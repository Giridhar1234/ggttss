import React from 'react';
import logo from './logo.svg';
import './GTTS.css';
import axios from 'axios';
import { Multiselect } from 'multiselect-react-dropdown';

import XLSX from 'xlsx';
import Switch from "react-switch";


import ExcelJS from'exceljs'
import FileSaver  from'file-saver';
// var json =[{
    
// "SNO" : 1,
// "EmployeeName" : "Chai",
// "Week1TaskName" : 1,
// "Week1Totalhours" : 1,
// "Week2TaskName" : 1,
// "Week2Totalhours" : 1,
// "Week3TaskName" : 1,
// "Week3Totalhours" : 1,
// "Week4TaskName" : 1,
// "Week4Totalhours" : 1,
// "1" : 1,
// "2" : 1
    
// }, {
    
// "SNO" : 1,
// "EmployeeName" : "Chai",
// "Week1TaskName" : 1,
// "Week1Totalhours" : 1,
// "Week2TaskName" : 1,
// "Week2Totalhours" : 1,
// "Week3TaskName" : 1,
// "Week3Totalhours" : 1,
// "Week4TaskName" : 1,
// "Week4Totalhours" : 1,
// "1" : 1,
// "2" : 1
// }];
var timesheet =[];
var leaves =[];
var  fulljson={};
var fs = require('fs');



  class GTTS extends React.Component  {
    constructor(props) {
      super(props);
      this.state = {  jsondata: [],
        timesheetjsondata:[],
        leavesjsondata:[],
        timesheetheader:[],
        leavesheader:[],
        presentweektext:'',
        presentweek:[],
        presentweekno:0,
        selectoptions:[],
        optionSelected:[],
        selected:null,
        activityname:'',
        empname:'',
        employeelist:    [], 
        username:  this.props.username,
        activitylist:  [], // ['activity1','activity2','activity3']   , 
        holidaystoggle: false,  
        filename:'',
        datatosheetjs:[],
        weektext:[],
        selectedweektext:'',
        selectedweeks:[],
        selectedweekno:0,
        weeks:[],
        weekends:[],
        weekdays:[],
        inptselectweek:true,
        inptselectactivity:true,
        btnadd:true,
        errormsg:'',
        user_weekdata:[],
        user_weekdata_keys:[],
        slectedworkingdays:[],
        selectedweekends:[],
        presentmonthname:'',
       }

       this.style={ chips: { background: "red" }, searchBox: { border: "none", "border-bottom": "1px solid blue", "border-radius": "0px" }}
 
         
  }
    

  componentDidMount(){

    var getempdataresult;
    let formdata =new FormData();  
    formdata.append('filename',"EmployeeData");
    axios.post("http://localhost:8002/getempdata",formdata)
        .then(res=>{  
          getempdataresult=   res.data;
       //   console.log("status text",res.data);
         // console.log("data from file text",getempdataresult.Activity);
        
        var EmployeeList=[];
        var ActivityList=[];
        getempdataresult.Activity.map((act)=>{
            ActivityList.push(act);
        });
        getempdataresult.Employee.map((emp)=>{
          EmployeeList.push(emp.EmpFirstName);

      });
          this.setState({activitylist:ActivityList,employeelist:EmployeeList},()=>{
            this.dataprocess();
          });

        })


  }
  
  dataprocess = function(){
      
    const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"
];
    var empnames=this.state.employeelist;
    var  date = new Date();
    var   persentYear = date.getFullYear();
    var persentMonth = date.getMonth();
    var persentDate = date.getDate();     
    console.log("persentDate",persentDate);
    var firstDate = new Date(persentYear, persentMonth, 1);
    var lastDate = new Date(persentYear, persentMonth + 1, 0);
    var numDays = lastDate.getDate();
    console.log("firstdgetFullYearay",persentYear,"||| getMonth",persentMonth,date);
    var weeks=  this.getWeeksStartAndEndInMonth('monday',firstDate,numDays);
    console.log("res",weeks);
    var weekends=  this.getWeekendsInMonth(persentYear,persentMonth,numDays);
    console.log("res",weekends);
    var weekdays = this.getWeekdaysInMonth(persentYear,persentMonth,numDays);
    console.log("total working days: ",weekdays);
    var presentmonthname =monthNames[persentMonth];
var filename = persentYear+''+(persentMonth+1);
console.log(filename)

 // file check
// 
let filecehckformdata =new FormData();
filecehckformdata.append('filename',filename);
axios.post("http://localhost:8002/checkfileexists",filecehckformdata)
.then(res=>{  
              var fileexisits = res.data;
                console.log("status data",fileexisits);
 
  console.log("file exists: ",fileexisits)
  if(!fileexisits){
     //  create json 
     for(var i=0; i<empnames.length;i++){
      // var emplist={};
      var  timesheetrow = {}
      var  leavesrow = {}
      //start of timsheet row
      timesheetrow ["Sno"] = i+1;
      timesheetrow ["EmployeeName"] = empnames[i];
 
       for(var j=1; j<=weeks.length;j++){
        timesheetrow [`Week${j}TaskName`] = '';
        timesheetrow [`Week${j}Totalhours`] = 0;
       }
       for(var x=1; x<=numDays;x++){
        timesheetrow [`day${x}`] = 0;    //  days coloumn name
       }          // emplist[empnames[i]] = timesheetrow
       //end of time sheetrow

      //start of leaves row
      leavesrow ["Sno"] = i+1;
      leavesrow ["EmployeeName"] = empnames[i];
      leavesrow ["TotalWorkingdays"] = weekdays.length;
      leavesrow ["TotalHolidays"] = 0;
      leavesrow ["TotalLeaves"] = 0;
      leavesrow ["TotalFurLough"] = 0;
      leavesrow ["TotalOptionalHolidays"] = 0;
      leavesrow ["ActualWorkingdays"] = 0;
      leavesrow ["Actualworkinghrs"] = 0;
      leavesrow ["Entry"] = 'invalid';
      //end of leaves row
      timesheet.push(timesheetrow)
      leaves.push(leavesrow)
     }
    //  console.log("total working days: ",weekdays.length);
    // console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",timesheet)
     Object.assign(fulljson, {"timesheet": timesheet})
     Object.assign(fulljson, {"leaves": leaves})
     // fulljson.push(timesheet)  
    //  console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",fulljson)
    //  console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",JSON.stringify(timesheet))
     // console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",JSON.stringify(fulljson))

      var result;
    let formdata =new FormData();  
  formdata.append('filename',filename);
  formdata.append('jsondata',JSON.stringify(fulljson));
  axios.post("http://localhost:8002/createjsonfile",formdata)
      .then(res=>{  
        result=   res.data;
        console.log("status text",res.statusText);
       

      })
 

}else{
var weektext = [];
var presentweektext =''; 
var presentweek =[];
var presentweekno=0;

weeks.map((week,i)=>{

  //console.log("i is :",i+1); 
  weektext.push("week "+ (i+1) +" : ["+(week.start) + " to "+ (week.end)+"]" );

   if(week.start<= persentDate && week.end>= persentDate){
 // console.log(week,"week ",i+1); 
 presentweekno = i+1;
 presentweektext = "week "+ (i+1) +" : ["+(week.start) + " to "+ (week.end)+"]"  ;
 for(var i=week.start; i<=week.end;i++ ) {    presentweek.push(i) }

 // console.log("presentweek is :",presentweek); 
}

})


let formdata =new FormData();  
formdata.append('filename',filename);
axios.post("http://localhost:8002/getjsondata",formdata)
    .then(res=>{  
      result=   res.data;
      console.log("status text",res.data);
      console.log("data from file text",result.timesheet);
      console.log("data from file text",result.leaves);
      // result =JSON.parse(res.data)
     console.log("keys :", Object.keys(result.timesheet[0]))
    var options= presentweek.map((key, index) => {
     //  return            { label: key , value: key } })     
     return            { name: key.toString() , id: key}  })  
    //  console.log("options",options)
     var presentweekends=[];
      options.filter((day)=>{    // console.log(day.id)
       weekends.map((weekend)=>{ 
         if(weekend===day.id) { console.log(weekend); presentweekends.push(day) } 
         
        })

     })
     console.log("weekends in present week :",presentweekends,weekends)
   var timesheetheader = Object.keys(result.timesheet[0]);
 //  console.log(" before timesheet header : ",timesheetheader)
   timesheetheader.map((h,i)=>{ if(h.startsWith("day")){ timesheetheader[i]= parseInt(h.slice(3, 5)) }  })
   console.log(" after timesheetheader : ",timesheetheader)

  var leavesheader = Object.keys(result.leaves[0]);

      this.setState({presentmonthname:presentmonthname,timesheetheader:timesheetheader,leavesheader:leavesheader,weekdays:weekdays,weekends:weekends,weeks:weeks,weektext:weektext,filename:filename,jsondata:result,leavesjsondata:result.leaves,timesheetjsondata:result.timesheet,timesheet:timesheet,presentweek:presentweek,presentweektext:presentweektext,presentweekno:presentweekno});
      //console.log("options : ",options)
      this.jsontoarrayofarray(); //to sonvert json data to array of arrays to send to sheetjs
    })
}

})

  }

    getWeekdaysInMonth = function(persentYear,persentMonth,numDays) {
      let weekdays = [];
    for(var i=1;i<=numDays;i++){    //looping through days in month
      var newDate = new Date(persentYear,persentMonth,i)
      if(newDate.getDay()!==0 && newDate.getDay()!==6){   //if not Sunday and saturday
        weekdays.push(i);
      }
     }
      return weekdays;
    }

    getWeekendsInMonth = function(persentYear,persentMonth,numDays) {
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
 
  
   getWeeksStartAndEndInMonth = function(_start,firstDate,numDays) {
    let weeks = [];
 
    let start = 1;
    let end = 7 - firstDate.getDay();
    if (_start === 'monday') {
        if (firstDate.getDay() === 0) {
            end = 1;
        } else {
            end = 7 - firstDate.getDay() + 1;
        }
    }
    while (start <= numDays) {
        weeks.push({start: start, end: end});
        start = end + 1;
        end = end + 7;
        end = start === 1 && end === 8 ? 1 : end;
        if (end > numDays) {
            end = numDays;
        }
    }
  
    return weeks;
}






// renderTableHeader() {
//  // let timesheet = Object.keys(this.state.timesheetjsondata)
//   this.state.timesheet.map((key, index) => {
//     return <th key={index}>{key}</th>
//  }) 
// }
// renderTableData() {
//   return this.state.timesheetjsondata.map((emp, index) => {
//     let col = Object.keys(emp)
//     return (
        
    
//        <tr key={emp.EmployeeName}>
//          {col.map((val, index) => {
//              return <td key={index}>{emp[col[index]]}</td>
//           })}

//        </tr>
//     )
//   })
// }



onSelect(selectedList, selectedItem) {
 // console.log("event ",selectedItem)
 // console.log("event ",selectedList)
//  console.log("--------",this.state.selected)
  this.setState({optionSelected:selectedList});
}

onRemove(selectedList, removedItem) {
 // this.setState({optionSelected:selectedList});
 this.setState({optionSelected:selectedList});
}


onactivityselect(e){
 
  if(e.target.value==='Select Activity'){
    this.setState({errormsg:'Please Select Activity',btnadd:true});
  }else{
  console.log("activity selected: ",e.target.value)
  this.setState({btnadd:false,errormsg:'',});
  }
}

// onnameselect(e){ 
  
//   if(e.target.value==='Select User'){
//     this.setState({errormsg:'Please Select User',inptselectweek:true,inptselectactivity:true,btnadd:true});
//     document.getElementById('getweek').value='Select Week';
//    document.getElementById('getactivity').value='Select Activity';
//   }else{
//   console.log("selected EMP: ",e.target.value)
//   this.setState({inptselectweek:false,errormsg:'',});
//   }
// }
onweekselect(e){
  if(e.target.value==='Select Week'){
    this.setState({errormsg:'Please Select week',inptselectactivity:true,btnadd:true});
    document.getElementById('getactivity').value='Select Activity';
  }else{
  // this.setState({errormsg:'',inptselectactivity:false,selected:null,},()=>{
  //   this.carryweekopeartions();
  // } );
  this.carryweekopeartions();
 

    
    // this.setState({errormsg:'',inptselectactivity:false});
 
 }

}

handleadd(e){
  e.preventDefault();
  var getemp=document.getElementById('getemp').value;
  var getweek=document.getElementById('getweek').value;
  var getactivity=document.getElementById('getactivity').value;
  this.setState({activityname:getactivity,empname:getemp,errormsg:''},()=>this.updatetojson()
  );

  

}
carryweekopeartions = function(){

  var selectedweektext=document.getElementById('getweek').value;
  console.log("selected week: ",selectedweektext)
 // console.log("selected week: ",this.state.weektext.indexOf(selectedweektext) +1)
  var selectedweekno=this.state.weektext.indexOf(selectedweektext) +1 ;
  //console.log("selected week: ",this.state.weeks[selectedweekno-1].start)
 var selectedweek=this.state.weeks[selectedweekno-1];
 var selectedweekstart=selectedweek.start;
 var selectedweekend=selectedweek.end;
 var selectdweeks=[];
 for(var i=selectedweekstart;i<=selectedweekend;i++){
  selectdweeks.push(i);
 } 
 console.log("selected week: ",selectdweeks)
 var options= selectdweeks.map((key, index) => {
  //  return            { label: key , value: key } })     
  return            { name: key.toString() , id: key ,  }  })  
  var selectedweekends=[];
  var slectedworkingdays=[];
  console.log("selectedweekends",selectedweekends.length)
  console.log("slectedworkingdays",slectedworkingdays)

  options.filter((day)=>{     console.log(day.id)
    var count =0;
    this.state.weekends.map((weekend)=>{  
      if(weekend===day.id) {  selectedweekends.push(day);  console.log(selectedweekends.length,weekend,day.id)}
      else{ count++; if(count===this.state.weekends.length){ slectedworkingdays.push(day) } else{return false} }         
      
     })
     return day
    })
    console.log("selectedweekends",selectedweekends.length)
    console.log("slectedworkingdays",slectedworkingdays)
    var getemp=document.getElementById('getemp').value;
  var temp_json = this.state.timesheetjsondata;
  var weektaskname = `Week${selectedweekno}TaskName`
  var weektotalhours = `Week${selectedweekno}Totalhours`
var user_weekdata=[];

  temp_json.map( (user)  => { if(user.EmployeeName === getemp ){
   // console.log("testtttt",{EmployeeName:user.EmployeeName})
   console.log("selectedweekends",selectedweekends.length)
    console.log("slectedworkingdays",slectedworkingdays)
  
   user_weekdata ["EmployeeName"] = user.EmployeeName;
   user_weekdata [weektaskname] = user[weektaskname];
   user_weekdata [weektotalhours] = user[weektotalhours];
  
      slectedworkingdays.map((workingday)=>{       user_weekdata[`day${workingday.id}`]=user[`day${workingday.id}`]  })
       selectedweekends.map((weekendholiday)=>{        user_weekdata[ `day${weekendholiday.id}`]=user[ `day${weekendholiday.id}`]        })
    
  //  user_weekdata.push({"EmployeeName":user.EmployeeName});
  //  user_weekdata.push({[weektaskname]:user[weektaskname]});
  //  user_weekdata.push({[weektotalhours]:user[weektotalhours]});

  //  user_weekdata_keys.push("EmployeeName");
  //  user_weekdata_keys.push(weektaskname);
  //  user_weekdata_keys.push(weektotalhours);

  //   slectedworkingdays.map((workingday)=>{ var day = `day${workingday.id}`;
  //   user_weekdata.push({ [day]:user[day]})  ;user_weekdata_keys.push(day);   })
  //    selectedweekends.map((weekendholiday)=>{ var day = `day${weekendholiday.id}`;
  //    user_weekdata.push({ [day]:user[day]}) ;user_weekdata_keys.push(day);        })
    
}
});
var user_weekdata_keys= Object.keys(user_weekdata);
console.log("user_weekdata_keys",user_weekdata_keys)  
console.log("testtttt",user_weekdata);
var answer = [];
answer.push(user_weekdata_keys);
 answer.push(Object.values(user_weekdata)) ;
 console.log("answer",answer)  
 console.log("selectedweekends",JSON.stringify(selectedweekends))
 console.log("slectedworkingdays",slectedworkingdays)
var selected = Object.assign([], selectedweekends); // to add to multiselect as default options
  this.setState({slectedworkingdays:slectedworkingdays,user_weekdata:answer,user_weekdata_keys:user_weekdata_keys,errormsg:'',inptselectactivity:false,selectdweeks:selectdweeks,selectedweekno:selectedweekno,selectedweektext:selectedweektext,selectoptions:options,selected:selected,selectedweekends:selectedweekends});


}
updatetojson = function(e){
  var holiday_type;
  // var getemp=document.getElementById('getemp').value;
  // var getweek=document.getElementById('getweek').value;
  // var getactivity=document.getElementById('getactivity').value;
 
  if(this.state.optionSelected.length=== 0 && this.state.holidaystoggle === true){
   
    console.log("Please select holidays and hoiday Type :" )
  }
  else{
    var holidays=[];
    if(this.state.optionSelected.length=== 0 && this.state.holidaystoggle === false){
     // this.setState({optionSelected:this.state.selected});
      holidays=Object.assign([], this.state.selected);
      console.log("No Holidays except sun and sat  :",this.state.selected )
    }
    else{
      var holidays = document.getElementsByName('holiday');
      for(var i = 0; i < holidays.length; i++){
          if(holidays[i].checked){         
            holiday_type = holidays[i].value;
            break;
          }
      }
      if(holiday_type=== undefined && this.state.holidaystoggle === true){
        alert("Choose Holiday Type and save again!")
          console.log("undefined",undefined); 
          return; 
        }
      holidays=Object.assign([], this.state.optionSelected);
      console.log("optionSelected",holidays);
      console.log("No Holidays   :",this.state.selected );
    }
    console.log("holidays: ",holidays) 
    console.log("timesheetjsondata: ",this.state.timesheetjsondata) 
    var userdata = this.state.timesheetjsondata //.filter((item)=>{ if(item.EmployeeName===this.state.empname){return item} })
  
    var weektaskname = `Week${this.state.selectedweekno}TaskName`
    var weektotalhours = `Week${this.state.selectedweekno}Totalhours`
    var totalhours = (this.state.selectdweeks.length-holidays.length)*8;
    console.log(" add :",weektaskname,weektotalhours,(this.state.selectdweeks.length-holidays.length)*8);

    var workingdays = [];
    var weekendholidays = [];
    var weekdayholidays = [];
      this.state.selectoptions.map((item)=>{    // console.log(day.id)
      var count=0;
      if(holidays.length>0){
holidays.map((holiday)=>{ 
        if(item.id===holiday.id) {  weekendholidays.push("day"+item.id) ; return false } // weekendholidays will have holidays also
        else{ count++; if(count===holidays.length){ workingdays.push("day"+item.id) } else{return false} }       
       }) }
       else{
        workingdays.push("day"+item.id);
       }     
      })
      this.state.slectedworkingdays.map((item)=>{  
      holidays.map((holiday)=>{ 
        if(item.id===holiday.id) {  weekdayholidays.push("day"+item.id) ; return false }
        else{ return false }  
       })
      })
      console.log("weekdayholidays",weekdayholidays)
      console.log("weekendholidays",weekendholidays)
      console.log("workingdays",workingdays)
    console.log("before add : ",this.state.timesheetjsondata ) 
    this.state.timesheetjsondata.map( (user)  => { if(user.EmployeeName === this.state.empname ){
          user[weektaskname]= this.state.activityname ;
           user[weektotalhours]= totalhours;
           workingdays.map((workingday)=>{ user[workingday] = 8; })
           weekendholidays.map((weekendholiday)=>{ user[weekendholiday] = 0; })
           weekdayholidays.map((weekdayholiday)=>{

           //  var holiday_type= document.getElementById

          // console.log("holiday_type",holiday_type)
              user[weekdayholiday] = holiday_type; 
            })
          
    }
    });
    console.log("after update :",this.state.timesheetjsondata)
     this.jsontoarrayofarray(); //to sonvert json data to array of arrays to send to sheetjs
    //this.carryweekopeartions();
     this.setState({timesheetjsondata:this.state.timesheetjsondata,slectedworkingdays:this.state.slectedworkingdays})
    //  this.setState({
    //   holidaystoggle: false
    // });
  }
}
savetofile(e){
  e.preventDefault();
  var result;
  var holidayscount=0; var optholidayscount=0; var leavescount=0; var furloughcount =0;
  var totalworkinghrs=0; var actualworkingdays=0;  var actualworkinghrs=0;
  this.state.timesheetjsondata.map( (user)  => { if(user.EmployeeName === document.getElementById('getemp').value ) {
    for(var j=1; j<=this.state.weeks.length;j++){
      totalworkinghrs=totalworkinghrs + user[`Week${j}Totalhours`] ;
     }
     this.state.weekdays.map((day)=>{ 
       
      switch (user[`day${day}`]) {
        case 'H':
                holidayscount++;
                break;
        case 'O':
                optholidayscount++;
                break;
        case 'L':
                leavescount++;             
                break;
          case 'F':
                furloughcount++;
                break;
        default: if(user[`day${day}`]>0){actualworkingdays++
                actualworkinghrs = actualworkinghrs + user[`day${day}`]
                console.log('switch default',user[`day${day}`]);
        }
      }
     })
  }
  })
  console.log('print json',this.state.timesheetjsondata);
  
  console.log('switch default',holidayscount,optholidayscount,leavescount,furloughcount,totalworkinghrs,actualworkingdays,actualworkinghrs);
  this.state.leavesjsondata.map((user)=>{ if(user.EmployeeName === document.getElementById('getemp').value ) {
      user['TotalHolidays'] =holidayscount;
      user['TotalLeaves'] =leavescount;
      user['TotalFurLough'] =furloughcount;
      user['TotalOptionalHolidays'] =optholidayscount;
      user['ActualWorkingdays'] =actualworkingdays;
      user['Actualworkinghrs'] =actualworkinghrs;   
      var shouldworkingdays = user["TotalWorkingdays"] - holidayscount - leavescount - furloughcount - optholidayscount;
      console.log("shouldworkingdays",shouldworkingdays)
      if( actualworkinghrs === (shouldworkingdays*8) ){ user['Entry'] ='valid';    }
      else{ user['Entry'] ='invalid'; }
    }
   })
  // if( totalworkinghrs === (actualworkingdays*8) && totalworkinghrs === actualworkinghrs){  // to check total actualworking hours to totalworking hours
  this.jsontoarrayofarray();
  var tempfulljson = {};
  Object.assign(tempfulljson, {"timesheet": this.state.timesheetjsondata})
  Object.assign(tempfulljson, {"leaves": this.state.leavesjsondata})
  console.log("Hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",tempfulljson)
 // console.log("Hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",JSON.stringify(tempfulljson))
    let formdata =new FormData();  
      formdata.append('filename',this.state.filename);
      formdata.append('jsondata',JSON.stringify(tempfulljson));
      axios.post("http://localhost:8002/updatejson",formdata)
          .then(res=>{  
            result=   res.data;
            console.log("status text",res.statusText);
          
          })


  this.setState({  
      optionSelected:[],
      activityname:'',
      empname:'',
      holidaystoggle: false,
      inptselectweek:true,
      btnadd:true,
      inptselectactivity:true,
      errormsg:'',
      });

  
      document.getElementById('getweek').value='Select Week';
      document.getElementById('getactivity').value='Select Activity';
 //  }
 //  else{
 //   alert("Total Working hrs is not matching")
 //  }

}



toggleStatefalse() {
  this.setState({
    holidaystoggle: false
  });
}
toggleStatetrue() {
  this.setState({
    holidaystoggle: true
  });
}
jsontoarrayofarray(){

  // to make json to array of arrays to send to sheetjs
  var answer = [];
  var  date = new Date();
  var   persentYear = date.getFullYear();
  var persentMonth = date.getMonth();
  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
  var monthyear = [monthNames[persentMonth]+','+persentYear,""]
  answer.push(monthyear);
  answer.push(this.state.timesheetheader)
  var temp  = this.state.timesheetjsondata.map(el=>  Object.values(el)  )
  temp.map(el=>  answer.push(el) )
  var emptyrow = ["--","--","--"]
  answer.push(emptyrow);
  answer.push(emptyrow);
  answer.push(emptyrow);
  answer.push(this.state.leavesheader)
  var leavestemp  = this.state.leavesjsondata.map(el=>  Object.values(el)  )
  leavestemp.map(el=>  answer.push(el) )
  this.setState({datatosheetjs:answer})
   console.log("json answer",answer)
  //------------------------------------------------------


}
ontableactivityselect(e){
  this.state.timesheetjsondata.map( (user)  => { if(user.EmployeeName === document.getElementById('getemp').value ) {

 
    user[`Week${this.state.selectedweekno}TaskName`]= e.target.value ;
   console.log("activty change",user[`Week${this.state.selectedweekno}TaskName`]) ;
 }})
 this.jsontoarrayofarray(); //to sonvert json data to array of arrays to send to sheetjs
 this.setState({timesheetjsondata:this.state.timesheetjsondata})

}
// tableinptchange(e,id,totalwrkhrs){
//   var newval =  e.target.value;
//   var el = document.getElementById(id);
//    if(/\D/.test(e.target.value) )  // || e.target.value!=='H' || e.target.value!=='L' )
//   {
//   // alert("Please only enter numeric characters (Allowed input:0-9)")
//   el.value=0;
//   return;
     
//   }
//   else if(el.value>8){ el.value=8; newval=8}
//   else if( e.target.value===''){newval=0}
//   this.state.timesheetjsondata.map( (user)  => { if(user.EmployeeName === document.getElementById('getemp').value ) {
//      var tempval = user[id];
    
//    //  user[totalwrkhrs]= user[totalwrkhrs] - tempval ;
//      user[id]=parseInt(newval,10);
//     console.log("inpt",tempval,user[id],user[totalwrkhrs], parseInt(newval,10))
//      user[totalwrkhrs]= user[totalwrkhrs] - tempval + parseInt(newval,10) ;
//     console.log("inpt",tempval,user[id],user[totalwrkhrs], parseInt(newval,10)) ;
//   }})
//   this.jsontoarrayofarray(); //to sonvert json data to array of arrays to send to sheetjs
//   this.setState({timesheetjsondata:this.state.timesheetjsondata})
// }
tableinptchange(e,id,totalwrkhrs){
  var newval =  e.target.value;
  var el = document.getElementById(id);
  console.log("inpt",el.value,newval ) ;
  //el.value=5;
  //console.log("inpt", e.target.value, Number(e.target.value) ) ;  //NaN
  // }})
    if(   Number(e.target.value,10) <= 8 || e.target.value==='' ||e.target.value.toUpperCase()==='0O' ||  e.target.value.toUpperCase()==='0F'||  e.target.value.toUpperCase()==='0H' || e.target.value.toUpperCase()==='0L' )  //  /\D/.test(e.target.value) )  // || e.target.value!=='H' || e.target.value!=='L' )
  {
    this.state.timesheetjsondata.map( (user)  => { if(user.EmployeeName === document.getElementById('getemp').value ) {
      var tempval = user[id];
      user[`Week${this.state.selectedweekno}TaskName`]= document.getElementById('table_getactivity').value ;
        if(e.target.value===''){
          user[id]= 0;
         // console.log("space",tempval,user[id],user[totalwrkhrs]) ;
             if(tempval==='H'||tempval==='F'||tempval==='L'||tempval==='O'){  }
             else{ user[totalwrkhrs]= user[totalwrkhrs] - tempval + user[id] ;}
          
        }
        else if( e.target.value.toUpperCase()==='0F'|| e.target.value.toUpperCase()==='0O' || e.target.value.toUpperCase()==='0H' || e.target.value.toUpperCase()==='0L'){          
          user[id]= e.target.value.toUpperCase().slice(1, 2);
        }
        else{

             user[id]= Number(e.target.value,10) 
            // console.log("inpt1",tempval,user[id],user[totalwrkhrs], parseInt(newval,10))
             user[totalwrkhrs]= user[totalwrkhrs] - tempval + user[id] ;
          //  console.log("inpt2",tempval,user[id],user[totalwrkhrs], parseInt(newval,10)) ;
        }

    
       }})
      // this.jsontoarrayofarray(); //to sonvert json data to array of arrays to send to sheetjs
       this.setState({timesheetjsondata:this.state.timesheetjsondata})
   }
 // else if(el.value>8){ el.value=8; newval=8}
 // else if( e.target.value===''){newval=0}
 else{
  alert("Allowed inputs numeric: 0-8, Holiday: 'H' or 'h', Leave: 'L' or 'l', Optional Holiday: 'O' or 'o', FurLough: 'F' or 'f'  ")
  //  // el.value=0;
  //   return;
       
 }


}
exportFile() {
  /* convert state to workbook */
  this.jsontoarrayofarray(); //to sonvert json data to array of arrays to send to sheetjs
  var wb = new ExcelJS.Workbook();
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

  var ws = wb.addWorksheet("My worksheet" , {views: [{showGridLines:true}]});
  ws.addRows(this.state.datatosheetjs);
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
  ws.getRow(this.state.timesheetjsondata.length+6).font = {bold:true};

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
      this.state.timesheetheader.map((header,index)=>{ 
          if(this.state.weekends.indexOf(header) >=0){
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
  //end 
  /* generate XLSX file and send to client */
  wb.xlsx.writeBuffer().then(data=> {
    const blob = new Blob([data], { type:fileType }); 
    FileSaver.saveAs(blob, "GttsConsolidation.xlsx");
         });
  /* generate XLSX file and send to client */
  //XLSX.writeFile(wb, "sheetjs.xlsx")
};

 
render(){
     
  
    return (
    <div className="App">

              {/* <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h2 className="header-Text">  GTTS Consolidation  <br/></h2>  
                <img src={logo} className="App-logo" alt="logo" />
              </header> */}
              <h4 >Present Month : {this.state.presentmonthname}  </h4>
              <div id="div_fillsheet">

              <select id="getemp" className="dropdown__select" >
              <option class="placeholder">{this.props.username}</option>
                  {/* { this.state.employeelist.map((emp,index)=>  <option className="select-option" value={emp}>{emp}</option> )} */}
              </select>
              <select id="getweek" className="dropdown__select" onChange={(e)=>this.onweekselect(e)}  >
              <option class="placeholder">Select Week</option>
                  { this.state.weektext.map((week,index)=>  <option className="select-option" value={week}>{week}</option> )}
              </select>
              <select id="getactivity" className="dropdown__select" onChange={(e)=>this.onactivityselect(e)} disabled={this.state.inptselectactivity} >
              <option class="placeholder">Select Activity</option>
                  { this.state.activitylist.map((activity,index)=>  <option className="select-option" value={activity}>{activity}</option> )}
              </select>


                <button className="noholidays"  style={!this.state.holidaystoggle ?  {backgroundColor:'#0096fb'} : {backgroundColor:'#ddd'}} onClick={()=>this.toggleStatefalse()}>No Holidays</button>
                <button className="holidays" style={this.state.holidaystoggle ?  {backgroundColor:'#0096fb'} : {backgroundColor:'#ddd'}} onClick={()=>this.toggleStatetrue()}>Holidays</button>
                <span className="tooltip-wrapper disabled"  data-toggle="tooltip" data-placement="bottom" title={`${this.state.btnadd ? 'Select Activity' :''}`} >
                <button className="add btn btn-secondary" onClick={(e)=>this.handleadd(e)} disabled={this.state.btnadd} >Save</button>
                </span>
                <button className="btn btn-success m-2" onClick={()=>this.exportFile()} disabled={!this.state.datatosheetjs.length}  >Export</button>
                {/* <button className={`noholidays ${ !this.state.holidaystoggle ? 'btn btn-primary' : 'btn btn-dark' }`}  onClick={()=>this.toggleStatefalse()}>No Holidays</button>
                <button className={`holidays ${ this.state.holidaystoggle ? 'btn btn-primary' : 'btn btn-dark' }`}  onClick={()=>this.toggleStatetrue()}>Holidays</button> */}
              </div>
           { this.state.holidaystoggle && 
             
              <div id="div_holiday">
                <span>Holiday Type: </span>
                <span id="radio_holiday" style={{display: 'inline-block'}}>
                  <span  class="row ">
                    <span class="col-md-auto"><input type="radio" id="holiday" name="holiday" value="H"/> Holidays</span>
                    <span class="col-md-auto"><input type="radio"  id="optionlholiday" name="holiday" value="O"/> Optional Holiday</span>
                  </span>
                  <span class="row">
                    <span class="col-md-auto"><input type="radio"  id="furlough" name="holiday" value="F"/> Furlough</span>
                    <span class="col-md-auto"><input type="radio"  id="leave" name="holiday" value="L"/> Leave </span>
                  </span>
                </span>
                
                  <Multiselect 
                  options={this.state.selectoptions} // Options to display in the dropdown
                  selectedValues={this.state.selected} // Preselected value to persist in dropdown
                  onSelect={(selectedList, selectedItem)=>this.onSelect(selectedList, selectedItem)} // Function will trigger on select event
                  onRemove={(selectedList, selectedItem)=>this.onRemove(selectedList, selectedItem)} // Function will trigger on remove event
                  displayValue="name" // Property name to display in the dropdown options
                  closeOnSelect={false}
                  avoidHighlightFirstOption
                  placeholder="Select Dates Here"
                  style={ { multiselectContainer: {width:'300px',display: 'inline-block' },
                    chips: { color: 'black' },
                  optionContainer: {   border: '2px solid',width:'300px'}, 
                  searchBox: { border: "none", "borderBottom": "1px solid blue", "borderRadius": "0px",width:'300px' }}}
                    disablePreSelectedValues={true}
              />
                          </div>
           }
            
              {/* <input type="text" id="activityname" placeholder="enter Activity name" onChange={(e)=>this.changeactivityname(e)} /> */}
               
              
            {this.state.errormsg &&   <span className="alert alert-danger" role="alert" > {this.state.errormsg}</span>}
               
 
               
          {/* <Sheetjs exceldata={this.state.datatosheetjs}  keys={this.state.timesheet}/> */}

          {/* <Sheetjs exceldata={this.state.user_weekdata}  keys={this.state.user_weekdata_keys}/> */}


      {! this.state.inptselectactivity &&   
          
                <div className="" style={{margin: "auto",width: "60%"}}>
                <table class="table w-auto">
                  <thead class="thead-dark">
                     <tr>                   
                      <th>Employee</th>{/* <th>{document.getElementById('getemp').value}</th> */}
                      <th>{`Week ${this.state.selectedweekno} TaskName`}</th>
                      <th>{`Week ${this.state.selectedweekno} Totalhours`}</th>
                     {this.state.slectedworkingdays.map((workingday)=>{ return    <th>{workingday.id}</th>  })} 
                      {this.state.selectedweekends.map((weekendholiday)=>{  return  <th>{weekendholiday.id}</th>    })}   
                    </tr>
    </thead>
    <tbody>         
         { this.state.timesheetjsondata.map( (user)  => { if(user.EmployeeName === document.getElementById('getemp').value ) {
          return <tr>
                        <td>{user.EmployeeName}</td>
                        <td>
                              <select id="table_getactivity" className="" onChange={(e)=>this.ontableactivityselect(e)}>
                              { this.state.activitylist.map((activity,index)=>{ 
                                if(activity===user[`Week${this.state.selectedweekno}TaskName`]){return <option className="select-option" value={activity}selected >{activity}</option>}
                                else{return <option className="select-option" value={activity}>{activity}</option>}
                              
                              }  )}
                              </select>
                        </td> 
                        <td>{user[`Week${this.state.selectedweekno}Totalhours`]}</td>
                      { this.state.slectedworkingdays.map((workingday)=>  { 
                            return <td className={`tdday${workingday.id}`}> <input type='text' name={`day${workingday.id}`} id={`day${workingday.id}`} key={`day${workingday.id}`} min="0" max="8" onKeyDown={ (evt) => evt.key === 'e' && evt.preventDefault() }  value={user[`day${workingday.id}`]} className={`day${workingday.id} form-control`} onChange={(e)=>this.tableinptchange(e,`day${workingday.id}`,`Week${this.state.selectedweekno}Totalhours`)} /> 
                        </td> })}
                      {this.state.selectedweekends.map((weekendholiday)=>{   return  <td className="bg-danger">{user[`day${weekendholiday.id}`]}</td>    })}
            </tr>
        }
        else{
          return <tr></tr>
        } })   }
                                <tr>
        
  
            </tr>

                  
  
                    </tbody>
  </table>
  <div class="info"><b>Note:</b> Enter <b>H</b> for Holidays, <b>L</b> for Leaves, <b>O</b> for Optional Holiday, <b>F</b> for Forlough. </div>

  <button type="button" className=" btn btn-dark" onClick={(e)=>this.savetofile(e)}>Submit</button>

  {/* <Sheetjs exceldata={this.state.datatosheetjs}  keys={this.state.timesheet}/> */}
  </div>

  
      }
 
          
    </div>
  );
    }
}

export default GTTS;

