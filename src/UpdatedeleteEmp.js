import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

let inputMail = true;
let inputContact = true;
let inputLocation = true;
  class UpdatedeleteEmp extends React.Component  {
    constructor(props) {
      super(props);
      this.state = { 
                  empdetails: [],
                  activitydetails:[],
                  DesignationList:[],
                  ManagersList:[],
                  errormsg2:"",
                  showadd:true,
                  showupdate:false,
                  showview:false,
                  employeelist:[],
                  disablebutton:"",
                  errormsg:'',
                  viewupdate:false,
                  labellist:["Employee Id :","First Name :","Last Name :","Mail id :","Contact Number :","Location :","Designation :","Manager :","Last working day :","Date of joining :"],
                  inptidlist:["EmpId","EmpFirstName","EmpLastName","EmpMail","contact","Location","Designation","Manager","LWD","DOJ"],

       }
       
  }
    

    componentDidMount(){
      var result;
      let formdata =new FormData();  
      formdata.append('filename',"EmployeeData");
      axios.post("http://localhost:8002/getempdata",formdata)
          .then(res=>{      
            result =   res.data;
            console.log("status text",res.data);
            console.log("data from file text",result.Employee);

          var EmployeeList=[];
          var EmpEmailList={};
          var ActivityList=[];
          const DesignationList = [];
          const ManagerNames = [];
           result.Employee.map((emp)=>{
               EmployeeList.push(emp.EmpFirstName);
              // EmpEmailList[emp.EmpFirstName]=emp.EmpMail;

              if(emp.Designation === "Manager" || emp.Designation === "Delivery Manager"){
                const obj = {
                   EmpName: emp.EmpNmae,
                   Designation: emp.Designation,
                   EmpId : emp.EmpId,
                   contact: emp.contact,
                   MailId: emp.EmpMail,


                 }
                 ManagerNames.push(obj);
               }

           });


          result.Activity.map((act)=>{
              ActivityList.push(act);
          });

          result.Designation.map((act)=>{
            DesignationList.push(act);
          });

            this.setState({empdetails:result.Employee,
              activitydetails:ActivityList,
              employeelist:EmployeeList,
              DesignationList: DesignationList,
              ManagersList:ManagerNames});

          })

    }

    updateGtts = (EmpFirstName)=> { 

      let formdata =new FormData();  
      var result;
      var  date = new Date();
      var   persentYear = date.getFullYear();
      var persentMonth = date.getMonth();
      var filename = persentYear+''+(persentMonth+1);
      var lastDate = new Date(persentYear, persentMonth + 1, 0);
      var numDays = lastDate.getDate();
      var firstDate = new Date(persentYear, persentMonth, 1);
      var weeks=  4; // dummy 
      var weekdays = 22; // dummy
      formdata.append('filename',filename);
      formdata.append('empname',EmpFirstName);
      formdata.append('action','deleteemployee');
      formdata.append('numDays',numDays);
      formdata.append('weeks',weeks);
      formdata.append('weekdays',weekdays);

      axios.post("http://localhost:8002/updategttsemp",formdata)
          .then(res=>{  
            result=res.data;
            console.log("status text",res.statusText);
          })

    }

   
    updateemployee(){

    

      var tempfulljson = {};
      Object.assign(tempfulljson, {"Employee": this.state.empdetails})
      Object.assign(tempfulljson, {"Activity": this.state.activitydetails})
      Object.assign(tempfulljson, {"Designation": this.state.DesignationList})
      let formdata =new FormData();  
      var result;
      formdata.append('filename',"EmployeeData");
      formdata.append('jsondata',JSON.stringify(tempfulljson));
      axios.post("http://localhost:8002/addEmployee",formdata)
          .then(res=>{  
            result =   res.data;
            console.log("status text",res.statusText);
            this.setState({errormsg2:"Update successful"})
           
          })

         
    }

    handleemployee(e,id){
      let validEmailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      let inputDesignation =  document.getElementById("selectDesignation").value;
      let inputManager =  document.getElementById("SelectManager").value;
      switch (id) {
        case "EmpMail":  if( e.target.value.match(validEmailRegex) ){
    
                                this.state.empdetails.map((emp,index)=>{ if(emp.EmpFirstName === document.getElementById('getemp').value){ 
                               
                                  return    emp[id]= e.target.value;
                                  
                              }       
                              })
                              inputMail = true;
                              document.getElementById("inputMail").innerHTML = " ";  

                        }else{
                          this.state.empdetails.map((emp,index)=>{ if(emp.EmpFirstName === document.getElementById('getemp').value){ 
                            return    emp[id]= e.target.value;
                            
                        }       
                        })
                          inputMail = false;     
                            document.getElementById("inputMail").innerHTML = "Enter correct Email Format"
                        } 
         break;
        
         case "contact":  if(isNaN(e.target.value)|| e.target.value<999999999 || e.target.value>9999999999){
                               
                                 this.state.empdetails.map((emp,index)=>{ if(emp.EmpFirstName === document.getElementById('getemp').value){ 
                                return    emp[id]= e.target.value;
                            }       
                            })
                            inputContact = false;
                            document.getElementById("inputContact").innerHTML = " Enter 10 digit Mobile number ";
                               

                  }else{
                    inputContact = true;
                    document.getElementById("inputContact").innerHTML = " ";
                    this.state.empdetails.map((emp,index)=>{ if(emp.EmpFirstName === document.getElementById('getemp').value){ 
                       
                      return    emp[id]= e.target.value;
                  }       
                  })

                  }
          break;
          
         case "Location":  if(e.target.value.length>4 ){
                                  inputLocation = true;
                                  document.getElementById("inputLocation").innerHTML = " "
                                  
                                    this.state.empdetails.map((emp,index)=>{ if(emp.EmpFirstName === document.getElementById('getemp').value){ 
                                     return    emp[id]= e.target.value;
                                  }       
                                  })

                            }else{
                              inputLocation = false;
                              document.getElementById("inputLocation").innerHTML = "location should not be less than three letters "
                              this.state.empdetails.map((emp,index)=>{ if(emp.EmpFirstName === document.getElementById('getemp').value){ 
                                return    emp[id]= e.target.value;
                             }       
                             })
                            }
                    break;
                  
         case "Designation":  this.state.empdetails.map((emp,index)=>{ if(emp.EmpFirstName === document.getElementById('getemp').value){ 
                         return    emp[id]= e.target.value;
                      }       
                      })
                      break;
        default:
          break;
      }

      if(inputLocation){
        if(inputContact){
          if(inputMail){
            this.setState({disablebutton:false})
          }else{
            this.setState({disablebutton:true})
          }

        }else{
          this.setState({disablebutton:true})
        }

      }else{
        this.setState({disablebutton:true})
      }
        
     
             
        // if(inputLocation  || inputMail.toString === "true" || inputContact.toString() === "true" ){

        //   this.setState({disablebutton:false})
        //   console.log({inputLocation,inputMail,inputContact});
              
             
        // }else{
  
        //   this.setState({disablebutton:true});
        //   console.log("error")
  
        // }
    
      console.log("update",this.state.empdetails);
      this.setState({empdetails:this.state.empdetails})
    }


    handleManager(e,id){
      console.log(e.target.value);

      let Manager = this.state.ManagersList.filter(manager => {return manager.EmpName === e.target.value.toString()
  })
    console.log(Manager);
try{

    this.state.empdetails.map((emp,index)=>{ if(emp.EmpFirstName === document.getElementById('getemp').value){ 
                emp[id]= e.target.value;
                emp["ManagerContact"] = Manager[0].contact;
                emp["ManagerMail"] = Manager[0].MailId;
                emp["ManagerId"] = Manager[0].EmpId;
  }       
  })
}
catch{
  console.log("Manager not Found");
}

    }

    deleteemployee(){
            
      console.log(document.getElementById('getemp').value);
      console.log(document.getElementById('EmpFirstName').value);
     const empid = document.getElementById('EmpFirstName').value;
     
        var empde = this.state.empdetails;
        empde.map((emp,index)=>{ if(emp.EmpFirstName === empid){ 
               
               delete empde[index];
         }       
         })
         var res= empde.filter((emp)=> emp !== null)  
         var EmployeeList=[];
         res.map((emp)=>{
              EmployeeList.push(emp.EmpFirstName);
             // EmpEmailList[emp.EmpFirstName]=emp.EmpMail;
          });
         this.setState({empdetails:res,viewupdate:false,employeelist:EmployeeList},()=>{
            this.updateemployee();
            console.log(empid);
            this.updateGtts(empid);
          })
        }
      
    

    onnameselect(e){ 
       this.setState({errormsg2:" "})
      if(e.target.value==='Select User'){
        this.setState({errormsg:'Please Select User',viewupdate:false});
      }else{
      console.log("selected EMP: ",e.target.value)
      this.setState({viewupdate:true,errormsg:'',});
      }
    }
    
   
  
      render(){
        //console.log("this.state.empdetails",this.state.empdetails)
  
    return (
    <div className="AppUpdatedeleteEmp">
      
                 <div> 
                 {<div style={{color:"red",fontSize:"15px"}} >{this.state.errormsg2}</div>}
                <select id="getemp" className="dropdown__select" onChange={(e)=>this.onnameselect(e)} >
              <option class="placeholder">Select User</option>
                  { this.state.employeelist.map((emp,index)=>  <option className="select-option" value={emp}>{emp}</option> )}
              </select>
              
                  {this.state.errormsg &&   <span className="alert alert-danger" role="alert" > {this.state.errormsg}</span>}
                
                  {this.state.viewupdate &&    <div>  {this.state.empdetails.map((emp,index)=>{ if(emp.EmpFirstName === document.getElementById('getemp').value){ 
                        return <table key={index}>
                       
                      {/* {this.state.inptidlist.map((id,index)=>{
                        return  <tr> 
                                   <td> 
                                     <label>
                                       <b>{this.state.labellist[index]}</b>
                                    </label>
                                    </td> 
                                    <td> 
                                        <input type="text" id={id} required value={emp[id]} onChange={(e)=>this.handleemployee(e,id)}/>
                                    </td>
                                 </tr>
                      })} */}
                      {this.state.inptidlist.map((id,index)=>{
                      if(id==='LWD' || id === 'DOJ' || id === 'EmpId' || id==='EmpFirstName'||id==='EmpLastName'){
                        return  <tr>  <td> <label><b>{this.state.labellist[index]}</b></label></td> <td>  <input type="text" disabled={true} id={id} required value={emp[id]} onChange={(e)=>this.handleemployee(e,id)}/></td></tr>
                      }else if(id === "Designation"){

                        return  <tr> 
                                  <td>
                                     <label><b>{this.state.labellist[index]}</b></label>
                                  </td>
                                   <td> 
                                   <select id="selectDesignation" onChange={(e)=>this.handleemployee(e,id)}>
                                         <option className="placeholder" value={emp[id]}>{emp[id]}</option>
                                      {this.state.DesignationList &&  this.state.DesignationList.map((emp,index)=>  <option  className="select-option" value={emp}>{emp}</option> )}
                                  </select>
                                   </td>
                                 </tr>
                      
                      }else if(id === "Manager"){

                        return  <tr> 
                                  <td>
                                     <label><b>{this.state.labellist[index]}</b></label>
                                  </td>
                                   <td> 
                                   <select id="SelectManager" onChange={(e)=> this.handleManager(e,id)}>
                                         <option className="placeholder" value={emp[id]}>{emp[id]}</option>
                                         {this.state.ManagersList && this.state.ManagersList.map((emp,index)=>  <option className="select-option" value={emp.EmpName}>{emp.EmpName}</option> )}
                                  </select>
                                   </td>
                                 </tr>
                      
                      }else if(id === "EmpMail"){

                        return  <tr> 
                                  <td>
                                     <label><b>{this.state.labellist[index]}</b></label>
                                  </td>
                                   <td> 
                                   <input type="email"  id={id} required value={emp[id]} onChange={(e)=>this.handleemployee(e,id)}/>
                                   <span id="inputMail" style={{color:"red",fontSize:"10px",margin:"10px"}}>{" "}</span>
                                   </td>
                                 </tr>
                      
                      }else if(id === "contact"){

                        return  <tr> 
                                  <td>
                                     <label><b>{this.state.labellist[index]}</b></label>
                                  </td>
                                   <td> 
                                   <input type="text" id={id}  required value={emp[id]} maxlength="10" onChange={(e)=>this.handleemployee(e,id)}></input>
                                   <span id="inputContact" style={{color:"red",fontSize:"10px",margin:"10px"}}>{" "}</span>
                                   </td>
                                 </tr>
                      
                      }else if(id === "Location"){

                        return  <tr> 
                                  <td>
                                     <label><b>{this.state.labellist[index]}</b></label>
                                  </td>
                                   <td> 
                                   <input type="text" id={id}  required value={emp[id]} maxlength="10" onChange={(e)=>this.handleemployee(e,id)}></input>
                                   <span id="inputLocation" style={{color:"red",fontSize:"10px",margin:"10px"}}>{" "}</span>
                                   </td>
                                 </tr>
                      
                      }
                      // else{
                      //   console.log(id);
                      //   return  <tr>  <td> <label><b>{this.state.labellist[index]}</b></label></td> <td>  <input type="text" id={id} required value={emp[id]} onChange={(e)=>this.handleemployee(e,id)}/></td></tr>
                      // }

                      })}
                    </table>
               
                    }        
                    })} 
                                        <button  className="empaddsubmit btn btn-primary" disabled={this.state.disablebutton} onClick={() => this.updateemployee()} >Update</button>
                                        <button className="empaddsubmit btn btn-danger" onClick={()=> { if (window.confirm('Are you sure you wish to delete this Employee?')){ this.deleteemployee()}} }  >Delete</button>
                      </div>}
                  
                 </div>

   


      
               
    </div>
  )}
}

export default UpdatedeleteEmp;
