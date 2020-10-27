var express = require('express');
var app = express();
var fileUpload = require('express-fileupload');
app.use(fileUpload());
var cors = require('cors');
app.use(cors());
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
var sql = require("mssql");
var nodemailer = require('nodemailer');
const ExcelJS = require('exceljs');
const FileSaver = require('file-saver');
//const { set } = require('core-js/fn/dict');
// require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create();
//login to mail
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mail2giridharsai@gmail.com',
    pass: 'Something@@wrong'
  }
});

var mailsent =false;
setInterval(()=>{
  var date = new Date();
  var day = date.getDay();
  var time = date.getHours()
  if(day===5&& time ===18){
    if(mailsent===false){
      console.log(day,time);
      gttssendremindermail();
      mailsent=true;
    }
    else{
      console.log("mail already sent, don't send mail");
      if(time ===19){
        mailsent=false;
      }
    }
  }
          },3600000);
function gttssendremindermail(){ 

  let filename = "EmployeeData";
  var dropoffLocation = '/Files/';
  var filePath = __dirname + dropoffLocation + filename + '.json';


    var jsondata = fs.readFileSync(filePath);
    var mailids = JSON.parse(jsondata).Employee.map((emp)=>{ return emp.EmpMail });
   // console.log(mailids);
   console.log(mailids.join(';'));

  var mailOptions = {
    from: 'mail2giridharsai@gmail.com',
    to: mailids.join(';'),
    subject: 'GTTS Reminder',
    html: '<h1> GTTS Reminder </h1><p> Please fill GTTS, ignore if filled</p>'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      console.log("unable to send otp");
    } else {
      console.log('Email sent: ' + info.response);
    }
  });    

  return;
}

app.post('/updategttsemp', function (req, res) {
 
  let filename = req.body.filename.trim();
  let empname = req.body.empname.trim();
  let action = req.body.action.trim();
  let numDays =req.body.numDays.trim();
  let weeks =req.body.weeks.trim();
  let weekdays = req.body.weekdays.trim();
  var dropoffLocation = '/MonthlyJsonFiles/';
  var filePath = __dirname + dropoffLocation + filename + '.json';
 
if(fs.existsSync(filePath)){
  var file_content = fs.readFileSync(filePath);
  var content = JSON.parse(file_content);
  var timesheet = content.timesheet;
  var leaves = content.leaves;
if(action==='addemployee'){
        var  timesheetrow = {}
        var  leavesrow = {}
        timesheetrow ["Sno"] = timesheet.length+1;
        timesheetrow ["EmployeeName"] = empname;
   
         for(var j=1; j<=weeks;j++){
          timesheetrow [`Week${j}TaskName`] = '';
          timesheetrow [`Week${j}Totalhours`] = 0;
         }
         for(var x=1; x<=numDays;x++){
          timesheetrow [`day${x}`] = 0;    //  days coloumn name
         }          // emplist[empnames[i]] = timesheetrow
         //end of time sheetrow
 
        //start of leaves row
        leavesrow ["Sno"] = leaves.length+1;
        leavesrow ["EmployeeName"] = empname;
        leavesrow ["TotalWorkingdays"] = weekdays;
        leavesrow ["TotalHolidays"] = 0;
        leavesrow ["TotalLeaves"] = 0;
        leavesrow ["TotalFurLough"] = 0;
        leavesrow ["TotalOptionalHolidays"] = 0;
        leavesrow ["ActualWorkingdays"] = 0;
        leavesrow ["Actualworkinghrs"] = 0;
        leavesrow ["Entry"] = 'invalid';
 
        timesheet.push(timesheetrow)
        leaves.push(leavesrow)
        }
    if(action==='deleteemployee'){
          var temptimesheet = timesheet;
          var templeaves = leaves;
 
          temptimesheet.map((emp,index)=>{ if(emp.EmployeeName === empname){ 
                 delete temptimesheet[index];
           }       
           })
           var timesheet= temptimesheet.filter((emp)=> emp !== null  )  
 
           templeaves.map((emp,index)=>{ if(emp.EmployeeName === empname){ 
            delete templeaves[index];
            }       
            })
          var leaves= templeaves.filter((emp)=> emp !== null     )  
 
      }
        var tempfulljson = {};
        Object.assign(tempfulljson, {"timesheet": timesheet})
        Object.assign(tempfulljson, {"leaves": leaves})
          console.log(tempfulljson);
          console.log("Stringify",JSON.stringify(tempfulljson));
         // console.log("Parse",JSON.parse(tempfulljson));
         
        fs.writeFileSync(filePath,JSON.stringify(tempfulljson) );
 
        res.send("Details Updated");
}
else{
  res.send("File not Created");
}
 
});

app.post('/checkfileexists', function (req, res) {

  let filename = req.body.filename.trim();
  var dropoffLocation = '/MonthlyJsonFiles/';
  var filePath = __dirname + dropoffLocation + filename + '.json';
  console.log(filePath)
  //console.log(fs.existsSync(filePath));
  res.send(fs.existsSync(filePath));
});

app.post('/createjsonfile', function (req, res) {

  let filename = req.body.filename.trim();
  let jsondata = req.body.jsondata.trim();
  var dropoffLocation = '/MonthlyJsonFiles/';
  var filePath = __dirname + dropoffLocation + filename + '.json';

fs.writeFileSync(filePath,jsondata );

var file_content = fs.readFileSync(filePath);
var content = JSON.parse(file_content);
//console.log(content)

  res.send(filePath);


});

app.post('/getjsondata', function (req, res) {

  let filename = req.body.filename.trim();
  var dropoffLocation = '/MonthlyJsonFiles/';
  var filePath = __dirname + dropoffLocation + filename + '.json';
  try {

    var jsondata = fs.readFileSync(filePath);
   
     //chatdata = chatdata.toString().replace(/,\s*$/, "");
     //console.log("filename ", jsondata)
     res.send( jsondata );
  }
  catch{
    //console.log("empty")
   res.send( jsondata );
  }


});

app.post('/updatejson', function (req, res) {

  let filename = req.body.filename.trim();
  let jsondata = req.body.jsondata.trim();
  var dropoffLocation = '/MonthlyJsonFiles/';
  var filePath = __dirname + dropoffLocation + filename + '.json';

fs.writeFileSync(filePath,jsondata );

var file_content = fs.readFileSync(filePath);
var content = JSON.parse(file_content);
//console.log(content)

  res.send(filePath);


});
app.post('/addEmployee', function (req, res) {

  let filename = req.body.filename.trim();
  let jsondata = req.body.jsondata.trim();
  var dropoffLocation = '/Files/';
  var filePath = __dirname + dropoffLocation + filename + '.json';

fs.writeFileSync(filePath,jsondata );


var file_content = fs.readFileSync(filePath);
var content = JSON.parse(file_content);
console.log(content)
InitiateProcess();
  res.send(filePath);


});
// edite on 7/2/2020 --- adding authentication
app.post('/getempdata', function (req, res) {

  let filename = req.body.filename.trim();
  var dropoffLocation = '/Files/';
  var filePath = __dirname + dropoffLocation + filename + '.json';
  try {

    var jsondata = fs.readFileSync(filePath);
   
     //chatdata = chatdata.toString().replace(/,\s*$/, "");
    // console.log("filename ", jsondata)
     res.send( jsondata );
  }
  catch{
    console.log("empty")
   res.send( jsondata );
  }


});

app.post('/sendotp', function (req, res) {

  let empname = req.body.empname.trim();
  let Mailid =  req.body.empmailid.trim();


  try {
    const Otp = Math.floor(100000 + Math.random() * 900000);

    var mailOptions = {
      from: 'mail2giridharsai@gmail.com',
      to: Mailid,
      subject: 'GTTS Login OTP',
      html: '<h1>'+Otp+'</h1><p> OTP Expires in 2 minutes. Please Hurry!</p>'
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        res.send("unable to send otp");
      } else {
        console.log('Email sent: ' + info.response);
        obj = {Otp:Otp.toString(),empName:empname};
        res.send(obj);
      }
    });     
  }
  catch(error){
    console.log(error)
    res.send("unable to send otp");
  }


});

// trigger mails from 22nd of every month
var sentMail = false;

setInterval(()=>{

  var date = new Date();
  var day = date.getDay();
  var time = date.getHours()

  if( day > 21 && time === 10 ){

    if(sentMail === false){

      console.log(day,time);
      gttssendmail();
      sentMail = true;

   }
    else
    {
      console.log("mail already sent, don't send mail");
     
        sentMail = false;
      
    }
 }
          },3600000);

function gttssendmail(){ 

  var date = new Date();
  var persentYear = date.getFullYear();
  var persentMonth = date.getMonth();
  var lastDate = new Date(persentYear, persentMonth + 1, 0);
  var numDays = lastDate.getDate();
  var weekends=  getWeekendsInMonth(persentYear,persentMonth,numDays);
  let filename = persentYear+'6';
  var dropoffLocation = '/MonthlyJsonFiles/';
  var filePath = __dirname + dropoffLocation + filename + '.json';
          
  // try
  // {
    var jsondataraw = fs.readFileSync(filePath);

    let jsondata = JSON.parse(jsondataraw);

    let timesheetheader = Object.keys(jsondata.timesheet[0]);
    //  console.log(" before timesheet header : ",timesheetheader)
      timesheetheader.map((h,i)=>{ if(h.startsWith("day")){ timesheetheader[i]= parseInt(h.slice(3, 5)) }  })
      console.log(" after timesheetheader : ",timesheetheader)
   
     let leavesheader = Object.keys(jsondata.leaves[0]);

     let timesheetjsondata = jsondata.timesheet;

     let leavesjsondata = jsondata.leaves;
   
     let answer = [];

     const monthNames = ["January", "February", "March", "April", "May", "June",
     "July", "August", "September", "October", "November", "December"
   ];

   var monthyear = [monthNames[persentMonth]+','+persentYear,""]
   answer.push(monthyear);
   answer.push(timesheetheader)
   var temp  = timesheetjsondata.map(el=>  Object.values(el)  )
   temp.map(el=>  answer.push(el) )
   var emptyrow = ["--","--","--"]
   answer.push(emptyrow);
   answer.push(emptyrow);
   answer.push(emptyrow);
   answer.push(leavesheader)
   var leavestemp  = leavesjsondata.map(el=>  Object.values(el)  )
   leavestemp.map(el=>  answer.push(el) )

   let datatosheetjs = answer;
   console.log("json answer",answer)

   generateCsv(datatosheetjs,timesheetjsondata,timesheetheader,weekends);

//   }
//   catch
//   {
// console.log("++++++++++++++++++++++++ Catch ++++++++++++++++++++++++++++++++");
//   }
             
          
            // var mailOptions = {
            //   from: 'mail2giridharsai@gmail.com',
            //   to: 'mail2giridharsai@gmail.com',
            //   subject: 'GTTS Month End Notify',
            //   html: '<h1> GTTS Reminder </h1><p> Please fill GTTS, ignore if filled</p>'
            // };
            
            // transporter.sendMail(mailOptions, function(error, info){
            //   if (error) {
            //     console.log(error);
            //     console.log("unable to send otp");
            //   } else {
            //     console.log('Email sent: ' + info.response);
            //   }
            // });    
          
            return;
 }

 function  getWeekendsInMonth(persentYear,persentMonth,numDays) {
  let weekends = [];
//  for(var i=1 ; i>=numDays; i++){
for(var i=1;i<=numDays;i++){    //looping through days in month
  var newDate = new Date(persentYear,persentMonth,i)
  if(newDate.getDay()==0){   //if Sunday
    weekends.push(i);
  }
  if(newDate.getDay()==6){   //if Saturday
    weekends.push(i);
  }
 }
  return weekends;
}

 function jsontoarrayofarray(){

  // to make json to array of arrays to send to sheetjs
  let answer = [];
  var  date = new Date();
  let  persentYear = date.getFullYear();
  let persentMonth = date.getMonth();
  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
  var monthyear = [monthNames[persentMonth]+','+persentYear,""]
  answer.push(monthyear);
  answer.push(timesheetheader)
  var temp  = timesheetjsondata.map(el=>  Object.values(el)  )
  temp.map(el=>  answer.push(el) )
  var emptyrow = ["--","--","--"]
  answer.push(emptyrow);
  answer.push(emptyrow);
  answer.push(emptyrow);
  answer.push(leavesheader)
  var leavestemp  = leavesjsondata.map(el=>  Object.values(el)  )
  leavestemp.map(el=>  answer.push(el) )
  this.setState({datatosheetjs:answer})
   console.log("json answer",answer)
  //------------------------------------------------------


}

 function generateCsv(datatosheetjs,timesheetjsondata,timesheetheader,weekends){

  let date = new Date();

    /* convert state to workbook */
     //to sonvert json data to array of arrays to send to sheetjs
    var wb = new ExcelJS.Workbook();
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

    var ws = wb.addWorksheet("My worksheet" , {views: [{showGridLines:true}]});
    ws.addRows(datatosheetjs);
    // const ws = XLSX.utils.aoa_to_sheet(this.state.datatosheetjs);
    // const wb = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
    var borderStyles = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" }
    };
    ws.getRow(2).font = {bold:true};
    ws.getRow(timesheetjsondata.length+6).font = {bold:true};
  
    ws.eachRow( function(row, rowNumber) {
      row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
        if (cell.value === '--') {
           cell.value = '';
          }
          else if (cell.value === 'H'||cell.value === 'F'||cell.value === 'L'||cell.value === 'O') {
            cell.border = borderStyles;
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFF00' },
              bgColor: { argb: 'FFFF00' }
            };
            }   
          else{   
        cell.border = borderStyles;}
      });
    });
    
    var col=  ws.columns[9].letter;//column letter 
    ws.eachRow( function(row, rowNumber) {
     var ref=  col+rowNumber;
           if(row.worksheet.getCell(ref).value === 'valid'){  row.worksheet.getCell(ref).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '008000' },
            bgColor: { argb: '008000' }
          };  }
           if(row.worksheet.getCell(ref).value === 'invalid'){  row.worksheet.getCell(ref).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF0000' },
            bgColor: { argb: 'FF0000' }
          }; 
     }
     
    });
    //to add red color to weekend 
        var weekendcolor = [];
        timesheetheader.map((header,index)=>{ 
            if(weekends.indexOf(header) >=0){
                    weekendcolor.push(index);
            }
        });
        console.log("weekendcolor",weekendcolor)
        weekendcolor.map((wkend)=>{
  
          var col=  ws.columns[wkend].letter;//column letter 
          ws.eachRow( function(row, rowNumber) {
           var ref=  col+rowNumber;
                 if(row.worksheet.getCell(ref).value === 0){  row.worksheet.getCell(ref).fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FF0000' },
                  bgColor: { argb: 'FF0000' }
                }; 
           }
           
          });
        })
    //end '
    /* generate XLSX file and send to client */
    wb.xlsx.writeBuffer().then(data=> {
      //console.log(data);
      //fs.writeFileSync("./xlsx/gtts.xlsx", data)
      // const blob = new Blob([data], { type:fileType }); 
     //  FileSaver.saveAs(data, "GttsConsolidation.xlsx");
     
     var mailOptions = {
      from: 'mail2giridharsai@gmail.com',
      to: 'Suresh.Bhajantri@mphasis.com',
      subject: `GTTS Monthend-(${date.toLocaleDateString()}) Notify`,
      html: `
      <style>
            .divC{
              display: flex
            }

            h5{
              color: red
            }
      </style>

          <div class="divC">  Dear &nbsp; <strong> Manager </strong> ,</div>

      <P>Please Find the attachment of gtts-consolidation , for the month of <strong>${date.toLocaleDateString()}</strong></p> 

      </br>
      <h5>*This is system generated mail, please don't respond</h5>
      `,
      attachments: [
        {  
          filename: `gtts-consolidation-(${date.toLocaleDateString()}).xlsx`,
          content: data
        }],
      

    };
  
     transporter.sendMail(mailOptions, function(error, info){
              if (error) {
              console.log(error);
              } else {
              console.log('Email sent: ' + info.response);
              }
          });
       });
    /* generate XLSX file and send to client */
    //XLSX.writeFile(wb, "sheetjs.xlsx")


 }
//Employee details ========================================================================================
//============================================================================================================

let holdArray = [];
let ERDlist = [];
let dummieERDlist = [];
let queue = [];
let initialStart;
let Approvallist = [];
const date = new Date();





//this function executes when server starts

everydayexecutions();
app.get("/",(req,res) => {
  
     console.log("Initiating");
     
})


//Interval executes every 24 hrs.

function everydayexecutions(){
  let timeout;
  const date = new Date();
  let currenttimeInHours = date.getHours();
  timeout = (24 - currenttimeInHours)*3600000;
  console.log(timeout);
  initialStart = true;
  InitiateProcess();
  let timerId = setTimeout(() => {
   
   
    console.log("executing...");
    everydayexecutions();
    
  }, 720000);

}


function InitiateProcess() {

    let Employeedetails = fs.readFileSync("./Files/EmployeeData.json");
    
    holdArray = [];
    ERDlist = [];
    dummieERDlist = [];
    queue = [];
    Approvallist = [];

    //new process
    const currentDate =  new Date();
    currentDate.setHours(0,0,0,0)
    const CurrentDayInNumber = currentDate.getDate();
      const tomorrowDate = new Date();
    tomorrowDate.setDate(CurrentDayInNumber + 1);
    tomorrowDate.setHours(0,0,0,0);
    const dayAfterTomorrowDate = new Date();
    dayAfterTomorrowDate.setDate(CurrentDayInNumber + 2);
    dayAfterTomorrowDate.setHours(0,0,0,0);

    console.log(currentDate,"nextday :"+tomorrowDate,"dayafter :"+ dayAfterTomorrowDate);
    
    JSON.parse(Employeedetails).Employee.map(Emp => {
         
        const ERD = new Date(Emp.LWD);//ERD- Employee Release Date
        ERD.setHours(0,0,0,0)
        console.log(ERD);
       
        if(ERD > dayAfterTomorrowDate ){

                    let obj = {
                                empid : Emp.EmpId,
                                LWD : ERD,
                                empName: Emp.EmpNmae,
                                empfname: Emp.EmpFirstName,
                                emplname:Emp.EmpLastName,
                                EmpMail : Emp.EmpMail,
                            }

                    if(Emp.Hold){
                    
                        holdArray.push(obj)

                    }else{

                        // makking an array of Employees Release dates
                        ERDlist.push(obj);
                        

                    }
        }else{
          
                  let obj = {
                    empid : Emp.EmpId,
                    LWD : ERD,
                    empName: Emp.EmpNmae,
                    empfname: Emp.EmpFirstName,
                    emplname:Emp.EmpLastName,
                    EmpMail : Emp.EmpMail,
                    }
               
              if(Emp.Hold){
                        
                  holdArray.push(obj)

              }else if(Emp.MsgSent){

                
              } else{

                 // makking an array of Employees Release dates
                   dummieERDlist.push(obj);

              }
        }
    })

    //sorting the ERDList(array) according to latest release date(Ascending order)
     queue =  dummieERDlist.sort((a,b) => a.LWD - b.LWD);

     console.log(queue);
     console.log(ERDlist);

     //calling Handlesendmail function
     if(initialStart){
        handleSendMail();
     }

     


}

function handleMsgSent(empId){
    
  console.log(empId);
  let Employeedetails = fs.readFileSync("./Files/EmployeeData.json");
  let data = JSON.parse(Employeedetails);
  data.Employee.map(emp => {
      if(emp.EmpId === empId){
          emp.MsgSent = true;
          fs.writeFileSync("./Files/EmployeeData.json",JSON.stringify(data));
          
      }
  })

}


function handleSendMail(){


    if(queue.length > 0 ){

       
        //triggering mails
   
                 queue.map(Emp =>{

                         var mailOptions = {
                              from: 'mail2giridharsai@gmail.com',
                              to: 'mail2giridharsai@gmail.com',
                              subject: 'testing',
                              html: `
                              <style>
                                    #customers {
                                      font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
                                      border-collapse: collapse;
                                      width: 100%;
                                      margin: 1% 0%;
                                    }

                                    #customers td, #customers th {
                                      border: 1px solid #000;
                                      padding: 20px 0px;
                                      text-align: center;
                                    }

                                    .divC{
                                      display: flex
                                    }

                                    #customers th {
                                      padding-top: 12px;
                                      padding-bottom: 12px;
                                      text-align: center;
                                      background-color:#0081CF;
                                      color: white;
                                    }
                                    P{

                                      margin: 2% 0%;
                                    }
                                    h5{
                                      color: red
                                    }
                                    </style>
                                  <div class="divC">  Dear &nbsp; <strong> Manager </strong> ,</div>

                              <P>Please Find the details of resource , release on ${Emp.LWD.toDateString()}</p> 

                              <table id="customers">
                                  <thead>
                                     <tr>
                                       <th>Sno</th>
                                       <th>USER ID</th>
                                       <th> FIRSTNAME</th>
                                       <th> LASTNAME</th>
                                       <th>RELEASE DATE</th>
                                       <th>MAIL ID</th>
                                     </tr>
                                  </thead>
                                  <tbody>
                                      <tr>
                                        <td>1</td>
                                        <td>${Emp.empid}</td>
                                        <td>${Emp.empfname}</td>
                                        <td>${Emp.emplname}</td>
                                        <td>${Emp.LWD.toDateString()}</td>
                                        <td>tinnaluri.sai@mphasis.com</td>
                                      </tr>
                                  </tbody>
                              </table>
                              </br>
                              <h5>*This is system generated mail, please don't respond</h5>
                              `
                          };
                          
                          transporter.sendMail(mailOptions, function(error, info){
                              if (error) {
                              console.log(error);
                              } else {
                              console.log('Email sent: ' + info.response);
                              }
                          });
                       initialStart = false;
                    })
                                      //  queue.shift();
                                        // handleSendMail(); 

    }

}

app.post("/EployeedatatList" , (req,res) => {

    let Employeedetails = fs.readFileSync("./Files/EmployeeData.json");
    let data = JSON.parse(Employeedetails);
    //console.log(req);
    
    let Emp =  data.Employee.filter(emp => {return emp.EmpId === req.body.EmpId})
    res.send(Emp)

})

//Hold Employees from queue
app.post('/HoldEmp', (req,res) => {
//console.log(req.body)
    let Employeedetails = fs.readFileSync("./Files/EmployeeData.json");
    let data = JSON.parse(Employeedetails);
    console.log("390"+ JSON.parse(Employeedetails));

    data.Employee.map(Emp => {
        if(Emp.EmpId === req.body.id)
        {
            Emp.Hold = true;
            fs.writeFileSync("./Files/EmployeeData.json",JSON.stringify(data));
            InitiateProcess();
        }
    })
    //console.log(holdArray)
    res.send(holdArray);

})

//UnHold Employees from queue
app.post('/UnHoldEmp', (req,res) => {

    let Employeedetails = fs.readFileSync("./Files/EmployeeData.json");
    let data = JSON.parse(Employeedetails);
    //console.log(Employeedetails)

    data.Employee.map(Emp => {
        if(Emp.EmpId === req.body.id)
        {
            Emp.Hold = false;
            fs.writeFileSync("./Files/EmployeeData.json",JSON.stringify(data));
            InitiateProcess();
            
        }
    })
    //console.log(holdArray);
    
    res.send(holdArray)

})

//Add details to queue.
app.post('/Addqueue' , (req,res) => {
    //console.log(req.body);

    let Employeedetails = fs.readFileSync("./Files/EmployeeData.json");
    let data = JSON.parse(Employeedetails);
    data.Employee.map(Emp => {
            if(Emp.EmpId === req.body.EmployeId)
            {
                const EmpLWWD = req.body.lastday;
                Emp.LWD = EmpLWWD;
                fs.writeFileSync("./Files/EmployeeData.json",JSON.stringify(data));
                //console.log("inside details");
                
            }
        })
        //console.log(Employeedetails);
        
        let employee = data.Employee.filter(emp => {return emp.EmpId === req.body.EmployeId})
        InitiateProcess();
        res.send({Employee:employee});
      

    // }else{
    //     res.send("error");
    // }

   

})

app.get('/getEmployeeApproval' , (req,res) => {

  res.send(queue);

})

app.post('/ApproveEmp', (req,res) => {
      //console.log(req.body)
      let Employeedetails = fs.readFileSync("./Files/EmployeeData.json");
      let data = JSON.parse(Employeedetails);
      console.log("574"+ JSON.parse(Employeedetails));
  
      data.Employee.map(Emp => {
          if(Emp.EmpId === req.body.id)
          {
              Emp.MsgSent = true;
              fs.writeFileSync("./Files/EmployeeData.json",JSON.stringify(data));
              InitiateProcess();
          }
      })
      //console.log(holdArray)
      res.send(queue);
  
  })
  

//axios get queue(release dates)
app.get('/Addqueue' , (req,res) => {

    res.send(ERDlist);

})

//get Hold employees
app.get('/getHoldArray',(req,res) => {
    res.send(holdArray);
})


//end Employee detail=================================================
//===================

app.listen(8002, function () {
  console.log('App running on port 8002');
});

