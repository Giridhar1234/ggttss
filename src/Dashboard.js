import React from 'react';
import logo from './logo.svg';
import './App.css';


import GTTS from './GTTS.js'; 


  class Dashboard extends React.Component  {
    constructor(props) {
      super(props);
      this.state = { 
       
       }
       
  }
    

    componentDidMount(){

    }

    menuchange(menuitem){

    this.setState({ CurComp: menuitem })
  
     }
  

      render(){
        
  
    return (
    <div className="App">
      <div className="Menu">  
      {/* <div id="menu-link" className="0" onClick={()=>this.menuchange(<GTTS />)}> GTTS</div> */}
      
               </div>
    </div>
  )}
}

export default Dashboard;



