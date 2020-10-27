import React from 'react';
import logo from './logo.svg';
import './UpdateEmployee.css';
import axios from 'axios';
import AddEmployee from './AddEmployee.js';
import UpdatedeleteEmp from './UpdatedeleteEmp.js';
import ViewEmployees from './ViewEmployees.js';
import Activity from './Activity.js';

  class UpdateEmployee extends React.Component  {
    constructor(props) {
      super(props);
      this.state = { 
                  empdetails: [],
                  activitydetails:[],
                  showadd:true,
                  showupdate:false,
                  showview:false,
                  showactivity:false,
       }
       
  }
    

    componentDidMount(){
    

    }

    handleadd(e){
      this.setState({showupdate:false,showview:false,showadd:true,showactivity:false})

    }
    handleupdate(e){
      this.setState({showadd:false,showview:false,showupdate:true,showactivity:false})

    }
    handleview(e){
      this.setState({showupdate:false,showadd:false,showview:true,showactivity:false})

    }
    handleactivity(e){
      this.setState({showupdate:false,showadd:false,showview:false,showactivity:true})

    }
    
   
  
      render(){
       
    return (
    <div className="AppUpdateEmployee">
      
                <button className="addempbtn btn1 buttonupdate" onClick={(e)=>this.handleadd(e)}  >Add</button>
                <button className="updateempbtn btn1 buttonupdate" onClick={(e)=>this.handleupdate(e)}  >Update/Delete</button>
                <button className="viewallbtn btn1 buttonupdate" onClick={(e)=>this.handleview(e)}  >View All</button>
                <button className="activitybtn btn1 buttonupdate" onClick={(e)=>this.handleactivity(e)}  >Activity</button>
    <div className="updatecomponets ">
                {this.state.showadd && 
                  <AddEmployee />
                }

                {this.state.showupdate && <UpdatedeleteEmp/>
                }

                {this.state.showview &&  <ViewEmployees />
                }
                {this.state.showactivity &&  <Activity />
                }

</div>
      
               
    </div>
  )}
}

export default UpdateEmployee;



