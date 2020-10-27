import React,{Component} from 'react';
import logo from './logo.svg';
import './EmployeeDetails.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button  as bootButton} from 'react-bootstrap';
import { Navbar, Nav, NavDropdown, Form,  FormControl, Button, Table} from 'react-bootstrap';
import axios from 'axios';
import Queue from './Queue';
import Approval from './Aproval';
import Hold from './Hold';


let Interval;
class Employeedetails extends Component{
  constructor(props) {
    super(props);
    this.state = {
        changeButton:false,
        dummiestate:"",
        empdetails:"",
        diaplay:false,
        Empdetailslist:"",
        Empdetails:"",
        Hold:false,
        HoldEmpdisp:"",
        displayQueue:"",
        quedisp:false,
        unholdbutton:false,
        holdbutton:false,

    }

}

 async handleSearch(empid) {
  console.log(empid);
  
  let employee = await axios.post("http://localhost:8002/EployeedatatList", { EmpId : empid});
  console.log(employee.data.length);

   if(employee.data.length === 0){

    document.getElementById("div").innerHTML = "search result for \'"+empid+"\' not found"
    document.getElementById("div").style.color = "red";
    
   Interval=  setTimeout(() => {
      document.getElementById("div").innerHTML = ""
    }, 3000);

   }else{

    this.setState({Empdetails: employee.data[0]});
    console.log(this.state.Empdetails);

   }
 }

 async handleonClickQueue(empid){

  
  console.log(empid);
  
  let employee = await axios.post("http://localhost:8002/EployeedatatList", { EmpId : empid});
  console.log(employee.data);
  
  this.setState({Empdetails: employee.data[0],changeButton: false});
  console.log(this.state.Empdetails);
  

 }

 handleApproveConfirm = (Empid)=>{
  return(
    <div style={{display:"flex",flexDirection:"row",justifyContent:"center",fontSize:"15px",fontWeight:"bold"}} >
        
      <span>Are you Sure   &nbsp;&nbsp;</span>
      <button className="buttonupdate" onClick={() => this.handleApproval(Empid)}>Approve</button> &nbsp;
      <button  className="buttonupdate btn3" onClick={() =>  this.setState({unholdbutton:""})}>cancel</button>
                                                             
 </div>
)  
 }

 handleApproval = (Empid) =>{
  
   console.log(Empid);
   axios.post('http://localhost:8002/ApproveEmp' , {id : Empid} )
   .then( res => this.setState({unholdbutton:""}))
           
 }

 handleHoldConfirm = (Empid)=>{
  return(
    <div style={{display:"flex",flexDirection:"row",justifyContent:"center",fontSize:"15px",fontWeight:"bold"}} >
        
      <span>Are you Sure   &nbsp;&nbsp;</span>
      <button className="buttonupdate" onClick={() => this.handleHold(Empid)}>hold</button> &nbsp;
      <button  className="buttonupdate btn3" onClick={() =>  this.setState({unholdbutton:""})}>cancel</button>
                                                             
 </div>
)  
 }

 handleHold = (Empid) =>{

  console.log(Empid);
  
   axios.post('http://localhost:8002/HoldEmp' , {id : Empid} )
   .then( res => this.setState({unholdbutton:"",HoldEmpdisp:res.data})  )
           
          
      

 }

 handleUnholdConfirm = (Empid)=>{
  
  return(
       <div style={{display:"flex",flexDirection:"row",justifyContent:"center",fontSize:"15px",fontWeight:"bold"}} >
           <span>Are you Sure     &nbsp;&nbsp;</span>
          <button  className="buttonupdate " onClick={() => this.handleUnHold(Empid)}>Unhold</button>&nbsp;
          <button className="buttonupdate btn3" onClick={() =>  this.setState({unholdbutton:""})}>cancel</button>
    </div>
  )
  
}

 handleUnHold = (Empid) =>{

  axios.post('http://localhost:8002/UnHoldEmp' , {id : Empid} )
  .then( res =>   this.setState({unholdbutton:"",HoldEmpdisp:res.data}))

}

 handleonChange = (e) =>{

  let searchresult = this.state.Empdetailslist.map((details) => {if(details.EmpId.search(e.target.value) !== -1){return details.EmpId}});
  document.getElementById("searchdiv").innerHTML = searchresult;
  
}

handleupdateClick = (input) => {
 
  this.setState({ changeButton : true});

}

handleSubmit = (event) =>{

  event.preventDefault();

  axios.post('http://localhost:8002/Addqueue' , {
                                                 EmployeId: this.state.Empdetails.EmpId, 
                                                 lastday: event.target.lastday.value,
                                                 } )
  .then(res => {
       console.log(res.data);
       if(res.data.Employee.length === 0){

        document.getElementById("div").innerHTML = "Cant update the Employee deatils"
        document.getElementById("div").style.color = "red";

    Interval=    setTimeout(() => {
          document.getElementById("div").innerHTML = "";
        }, 3000);
        
       }else{
    
        this.setState({Empdetails: res.data.Employee[0],changeButton:false})
        console.log(this.state.Empdetails);
    
       }
   
       
       
  })
  

}

handleLogout = () => {
  sessionStorage.setItem("Login" , "false");
  this.props.logout()
 
}

componentWillUnmount(){
  clearTimeout(Interval)
}
 
render(){
  return(
    <div>
     
      
      {/* <Navbar expand="lg" variant="dark" bg="dark">
          <Navbar.Brand >Gtts - Consolidation</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                  <Nav.Link href="#home"></Nav.Link>
                  <Nav.Link href="#link"></Nav.Link>
                  
              </Nav>
              <Form inline >
                <input type="text" id="input" placeholder="Search" className="mr-sm-2" />
                <Button variant="outline-success" onClick ={(e) => this.handleSearch(document.getElementById("input").value)}>Search</Button>
              </Form>
             
          </Navbar.Collapse>
        </Navbar> */}
       
         <div style={{display:"flex",flexDirection:"row",justifyContent:"flex-end",marginTop:"8px",flexWrap:"wrap"}}>
         <span id="div" style={{marginRight:"40px"}}></span>
                {!this.state.changeButton  && <button  className="buttonupdate mr-2" onClick={() => this.handleupdateClick()}>Update</button> }
                
                {this.state.changeButton && <button  className="buttonupdate  mr-2" onClick={() => document.getElementById("submitbutton").click()}>Submit</button> }
     
                {this.state.changeButton && <button  className="buttonupdate btn3 mr-2" onClick={() => this.setState({changeButton:false})}>Cancel</button> }
             
                <input  type="text" id="input" placeholder="Enter ID" size="20" style={{border:"2px solid darkgrey" ,height:"30px",borderRadius:"2px" }} />
                <button className="buttonupdate btn1 mr-5"  onClick ={(e) => this.handleSearch(document.getElementById("input").value)}>Search</button>
            
          </div> 
         
        <header className="headerApp">
          <div className="containerApp">
        <div className="ContainerDiv">
          
                        {/* Employee details Div */}
                        <div className="employeeconatiner">
                        {/* <form  onSubmit={(e) => this.handleSubmit(e)}> */}
                                {/* Header */}

                                    <div style= {{
                                                borderBottom:"1px solid #ffff ",
                                                color:"#61dafb",
                                                marginBottom:"10px",
                                                marginTop:"10px"
                                                }}>
                                       <b> Employee Details</b>
                                    </div>

                                   <table>
                                       <tr>
                                           <td><b>Employee ID :</b></td>
                                            <td>{this.state.Empdetails.EmpId}</td>
                                       </tr>
                                       <tr>
                                           <td><b>Employee Name :</b></td>
                                           
                                                <td>{this.state.Empdetails.EmpNmae}</td>
                                           
                                       </tr>
                                       <tr>
                                           <td><b>Employee Mail :</b></td>
                                            <td>{this.state.Empdetails.EmpMail}</td>
                                       </tr>
                                       {/* <tr>
                                           <td><b>Date Of Join:</b></td>
                                            <td>{this.state.Empdetails.EmpMail}</td>
                                       </tr>
                                       <tr>
                                           <td><b>Release date :</b></td>
                                           {
                                               !this.state.changeButton && <td>{this.state.Empdetails.LWD}</td>
                                           }
                                          
                                            {
                                               this.state.changeButton &&  <td><input type="date" required name="lastday"></input></td>
                                           }
                                       </tr> */}
                                       <tr>
                                           <td><b>Contact :</b></td>
                                            <td>{this.state.Empdetails.contact}</td>
                                       </tr>
                                       
                                       
                                   </table>
                                   {/* <button type="submit" style={{display:"none"}} id="submitbutton"></button>
                            </form> */}
                        </div>
                        
                         {/* Employee Account details */}
                         <div className="employeeconatiner">
                         <form  onSubmit={(e) => this.handleSubmit(e)}> 
                              {/* header */}
                              <div style= {{
                                              borderBottom:"1px solid #ffff ",
                                              color:"#61dafb",
                                              marginBottom:"10px",
                                              marginTop:"10px"
                                          }}>
                                              <b>Employee Account</b>
                              </div>

                              {/* Account Details */}
                              <table>
                                    <tr>
                                        <td><b>Employee Account :</b></td>
                                          <td>{this.state.Empdetails.Account}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Project :</b></td>
                                        <td>{this.state.Empdetails.project}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Designation :</b></td>
                                          <td>{this.state.Empdetails.Designation}</td>
                                    </tr>
                                    <tr>
                                           <td><b>Date Of Join:</b></td>
                                            <td>{this.state.Empdetails.DOJ}</td>
                                       </tr>
                                       <tr>
                                           <td><b>Release date :</b></td>
                                           {
                                               !this.state.changeButton && <td>{this.state.Empdetails.LWD}</td>
                                           }
                                          
                                            {
                                               this.state.changeButton &&  <td><input type="date" height="10px" required name="lastday"></input></td>
                                           }
                                       </tr>
                                  
                                </table>
                                <button type="submit" style={{display:"none"}} id="submitbutton"></button>
                            </form>

                              </div>
                         
                         {/* Employee Manager details */}

                         <div className="employeeconatiner">
                                {/* Header */}
                                <div style= {{
                                                borderBottom:"1px solid #ffff ",
                                                color:"#61dafb",
                                                marginBottom:"10px",
                                                marginTop:"10px"
                                            }}>
                                        <b>Employee Manager</b>
                                </div>
                                <table>
                                       <tr>
                                           <td><b>Manager ID :</b></td>
                                            <td>{this.state.Empdetails.ManagerId}</td>
                                       </tr>
                                       <tr>
                                           <td><b>Manager :</b></td>
                                            <td>{this.state.Empdetails.Manager}</td>
                                       </tr>
                                       <tr>
                                           <td><b>Contact :</b></td>
                                           <td>{this.state.Empdetails.ManagerContact}</td>
                                       </tr>
                                       <tr> 
                                           <td><b>Mail ID :</b></td>
                                           
                                            <td>{this.state.Empdetails.ManagerMail}</td>
                                       </tr>
                                      
                                   </table>
                                  
                        </div>

       </div>
      {/* Update button  */}
             {/* <div style={{margin:"0px"}}>     */}
           {/* {!this.state.changeButton  && <Button style={{marginBottom:"5px"}}variant="primary" className="mr-2" onClick={() => this.handleupdateClick()}>Update</Button> }
                
           {this.state.changeButton && <Button style={{marginBottom:"5px"}}variant="primary" className="mr-2" onClick={() => document.getElementById("submitbutton").click()}>Submit</Button> }

           {this.state.changeButton && <Button style={{marginBottom:"5px"}}variant="primary" className="mr-2" onClick={() => this.setState({changeButton:false})}>Cancel</Button> } */}
{/*            
           </div> */}
           <div id="HoldMessageDiv">
                          {this.state.unholdbutton}
                        
            </div>
           <div className="ContainerDiv">
          
                        {/* Employee details Div */}
                        <div className="Queue">
                        <Queue  onClick={(e) => this.handleonClickQueue(e)} hold={(e) => this.setState({unholdbutton: this.handleHoldConfirm(e)})}></Queue>
                        </div>
                        <div className="Queue">
                        <Approval  onClick={(e) => this.handleonClickQueue(e)} Approval={(e) => this.setState({unholdbutton: this. handleApproveConfirm(e)})}></Approval>
                        </div>
                        <div className="Queue">
                          <Hold  onClick={(e) => this.handleonClickQueue(e)} unhold={(Empid) =>this.setState({unholdbutton: this.handleUnholdConfirm(Empid)}) }></Hold>
                        </div>
                        

       </div>    
 
       </div>
      </header>
    
    </div>
  );
}
}
export default Employeedetails;
