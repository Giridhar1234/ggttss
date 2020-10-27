import React from 'react';
import logo from './logo.svg';

import axios from 'axios';
import './EmployeeDetails.css'
export default class TableCom extends React.Component {
 
    constructor(props){
    super(props);
    this.state = {
        header : ["Employee Id","First Name","Last Name","Employee Name","Mail Id",
                  "Release date","Designation","contact","Location","Date Of Joining",
                  "Account","Project","Manager","Manager Id","Manager MailId","Manager Contact","Hold","Manager Approval"]
    }
    this.getHeader = this.getHeader.bind(this);
    this.getRowsData = this.getRowsData.bind(this);
    this.getKeys = this.getKeys.bind(this);
    }
    
    getKeys = function(){
        return Object.keys(this.props.data[0]);
    }
    
    getHeader = function(){
        var keys = this.state.header;
        return keys.map((key, index)=>{
        return <th key={key} style={{width:"100px"}}>{key}</th>
        })
    }
    
    getRowsData = function(){
        var items = this.props.data;
        var keys = this.getKeys();
        return items.map((row, index)=>{
        return <tr key={index}><RenderRow key={index} data={row} keys={keys}/></tr>
        })
        }
    
    render() {
    return (
    <div >
  
        
    <table className="sticky-header"  id="t02" >
    
    <thead >
    <tr>{this.getHeader()}</tr>
    </thead>
    <tbody>
    {this.getRowsData()}
    </tbody>
    
    </table>
    </div>
    
    );
    }
   }
   const RenderRow = (props) =>{
    return props.keys.map((key, index)=>{
    return <td key={props.data[key]} style={{border:"1px solid #dddddd"}}>{props.data[key].toString()}</td>
    })
   }