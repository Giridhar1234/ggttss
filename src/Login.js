import React from 'react';


import loginimg from './images/login-img.jpg';
import './Login.css';
import axios from 'axios';

let Interval1;
let Interval2;
let Interval3;
let Interval4;

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { errormsg:'',
        sucessmsg:'',
        EmployeeList:[],
        EmpEmailList:{},
        Otp:null,
        responseEmpName:"",
        resendotpbtn: false,
        empdetails:[]
    }
         
         }
               
         componentDidMount(){
           // this.loginpopup();
            
            var result;
            let formdata =new FormData();  
            formdata.append('filename',"EmployeeData");
            axios.post("http://localhost:8002/getempdata",formdata)
                .then(res=>{  
                  result=   res.data;
                  console.log("status text",res.data);
                  console.log("data from file text",result.Employee);
    
                var EmployeeList=[];
                var EmpEmailList={};
                result.Employee.map((emp)=>{
                    EmployeeList.push(emp.EmpFirstName);
                    EmpEmailList[emp.EmpFirstName]=emp.EmpMail;
    
                });
                console.log("EmployeeList",EmployeeList);
                console.log("EmpEmailList",EmpEmailList);
               // console.log("EmpEmailList",ActivityList);
                  this.setState({EmployeeList:EmployeeList,EmpEmailList:EmpEmailList,empdetails:result.Employee});
    
                })
    
        }
    // loginpopup(){
    //     document.getElementById('LoginPopup').style.display='block';
    // }

    validateUser(){
      
        let username = document.getElementById("getemp").value;
        let password = document.getElementById("password").value;
        console.log("otp",parseInt(password),this.state.Otp,this.state.responseEmpName,username)
        if(parseInt(this.state.Otp)===parseInt(password)){ 
            if(this.state.responseEmpName===username) {
                sessionStorage.setItem("loaded",true);
                var designation;
                this.state.empdetails.map((emp)=>{
                   if(emp.EmpFirstName===username){ designation = emp.Designation}
                });
                this.sendData(username,designation);
                this.setState({errormsg:''})
            }
            else{
                this.setState({errormsg:"username changed"});
            Interval4 =    setTimeout(() => {
                this.setState({errormsg:''})
            }, 3000);   
            }
        }
        else 
        {
            this.setState({errormsg:"Enter Correct OTP or Resend OTP"});
            Interval4 =    setTimeout(() => {
                this.setState({errormsg:''})
            }, 3000);            
        }
}
    SendOtp(){
     Interval1 =   setTimeout(()=>{
                    this.setState({resendotpbtn:true,Otp:null})
        },120000)      
         this.generateandsendotp();
       

    }
    ReSendOtp(){
     Interval2 =   setTimeout(()=>{
            this.setState({Otp:null})
                    },120000)
            this.generateandsendotp();
    }
    generateandsendotp(){
        var empname = document.getElementById('getemp').value;

        if(empname==='Select Employee'){
            this.setState({errormsg:'Please Select User'});
              
        Interval3 =    setTimeout(() => {
                this.setState({errormsg:''})
            }, 3000);

            return;
          }
        else{
          console.log("selected EMP: ",empname)
          console.log("selected EMP: ",this.state.EmpEmailList[empname])
            
          var result;
          let formdata =new FormData();  
          formdata.append('empname',empname);
          formdata.append('empmailid',this.state.EmpEmailList[empname]);
          axios.post("http://localhost:8002/sendotp",formdata)
            .then(res=>{  
              result=   res.data;
              console.log("status text",res.data);
              this.setState({Otp:res.data.Otp,responseEmpName:res.data.empName});

            });
            
 
         
          }
        
    
    }
    sendData = (username,designation) => {
        //  console.log("sending to app.js",this.state.EmployeeList)
          //console.log("sending to app.js",JSON.stringify (this.state.EmployeeList))
          this.props.parentCallback("true",username,designation);
          console.log("to_parent",username)
        }

      componentWillUnmount(){
          clearTimeout(Interval3);
          clearTimeout(Interval4);
          clearTimeout(Interval1);
          clearTimeout(Interval2);
      }

    render() { 
        return ( 
            <div>

          
        {/* <div id="LoginPopup"  className="login-wrapper">
            
           <div className="Login-box row">
                    <div className="login-img col-sm-6 col-md-6 col-lg-6">
                            <img src={loginimg} className="login-img-tag" alt={"hi"} />
                    </div>
                <table className="login col-sm-6 col-md-6 col-lg-6">
                    <tr>
                    <select id="" className="dropdown__select"  >
                        <option class="placeholder">Select Employee</option>
                            { this.state.EmployeeList.map((emp,index)=>  <option className="select-option" value={emp}>{emp}</option> )}
                        </select>
                        { !this.state.resendotpbtn && <button  id="submit" value="Login" onClick={(e) => this.SendOtp(e)}>Send OTP </button>}
                        { this.state.resendotpbtn && <button  id="submit" value="Login" onClick={(e) => this.ReSendOtp(e)}>Resend OTP </button> }
                    </tr>
                    <tr><input type="text" className="input100" name="password" id="password" placeholder="Enter OTP" /> </tr>
                    <tr><button  id="submit" value="Login" onClick={(e) => this.validateUser(e)}>Login </button></tr>
                    <tr><span style={{color:"red"}} > {this.state.errormsg} </span></tr>
                </table>

            </div > 
            
            </div>
            */}
            <div class="wrapper fadeInDown">
                <div id="formContent">
                    {/* <!-- Tabs Titles --> */}

                    {/* <!-- Icon --> */}
                    <div class="fadeIn first">
                    <img src={loginimg} className="login-img-tag" style={{height:"100px" ,width:"100px"}} alt={"hi"} />
                     </div>

                    {/* <!-- Login Form --> */}
                    <div>
                        <select id="getemp" className="Text fadeIn second"  >
                        <option class="placeholder">Select Employee</option>
                            { this.state.EmployeeList.map((emp,index)=>  <option className="select-option" value={emp}>{emp}</option> )}
                        </select>

                    <input type="text" id="password" className="Text fadeIn third" name="login" placeholder="Enter otp"/>
                    <div style={{display:"flex",justifyContent:"space-between",margin:"20px"}}>

                    { !this.state.resendotpbtn && <button className="Buttonsubmit fadeIn fourth" id="submit" value="Login" onClick={(e) => this.SendOtp(e)}>Send OTP </button>}
                    { this.state.resendotpbtn && <button className="Buttonsubmit fadeIn fourth" id="submit" value="Login" onClick={(e) => this.ReSendOtp(e)}>Resend OTP </button> }
                   

                    
                    <button className="Buttonsubmit fadeIn fourth" id="submit" value="Login" onClick={(e) => this.validateUser(e)}>Login </button>
                    </div>
               
                    </div>

                    {/* <!-- Remind Passowrd --> */}
                    <div id="formFooter">
                    {/* <a class="underlineHover" href="#">Forgot Password?</a> */}
                    <span style={{color:"red"}} > {this.state.errormsg} </span>
                    </div>

                </div>
            </div>
    </div> );
    }
}




