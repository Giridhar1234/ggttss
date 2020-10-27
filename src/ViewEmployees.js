import React from 'react';
import logo from './logo.svg';

import axios from 'axios';
import TableCom from './tableCom.js';

  class ViewEmployees extends React.Component  {
    constructor(props) {
      super(props);
      this.state = { 
        empdetails: [],
        data:"",
       }
       
  }
    

  componentDidMount(){
    var result;
    let formdata =new FormData();  
    formdata.append('filename',"EmployeeData");
    axios.post("http://localhost:8002/getempdata",formdata)
        .then(res=>{  
          result=   res.data;
          console.log("status text",res.data);
          console.log("data from file text",result.Employee);
          this.setState({empdetails:result.Employee,data:result.Employee});

        })

  }

    
   
  
      render(){

    return (
    <div className="AppViewEmployees">
      
      <div  className="TableCom">
              {this.state.data && <TableCom data={this.state.data} />}
              </div>

      
               
    </div>
  )}
}

export default ViewEmployees;



