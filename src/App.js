import React from 'react';
import logo from './logo.svg';
import './App.css';
import  GTTS from './GTTS';
import EmployeeDetails from './EmployeeDetails';
import UpdateEmployee from './UpdateEmployee';
import Login from './Login';


var button ='';


class App extends React.Component {

  constructor(props) {
    super(props);
     this.state = { Loggedin: sessionStorage.getItem('state') ? JSON.parse(sessionStorage.getItem('state')).Loggedin : false,
   // this.state = { Loggedin: true,
                    temp:null,
                    CurComp:<EmployeeDetails />,
                    user_name: sessionStorage.getItem('state') ? JSON.parse(sessionStorage.getItem('state')).user_name : false,
                    UserDesignation: sessionStorage.getItem('state') ? JSON.parse(sessionStorage.getItem('state')).UserDesignation : '',
                  
                  }
  }


onUnload = (event) => {
  sessionStorage.setItem("state", JSON.stringify(this.state))
}
componentDidMount() {
 console.log(sessionStorage.getItem('state'))
 window.addEventListener("beforeunload", this.onUnload)
 //console.log(JSON.parse(sessionStorage.getItem('state')));
}

componentWillUnmount() {
// console.log(sessionStorage.getItem('state'))
  window.removeEventListener("beforeunload", this.onUnload)
  // console.log(sessionStorage.getItem('state'))
}
 
 Logout(){
  sessionStorage.setItem("loaded",false)
  sessionStorage.removeItem('loaded');
  this.setState({ Loggedin: false })
 }

 callbackFunction = (childData,username,designation) => {
  if( childData ==='true' ){
  this.setState({ Loggedin: childData,user_name: username,UserDesignation:designation})
  this.onUnload();
  // console.log("EmployeeList in app.js "+ EmployeeList[0]);
  // var str = EmployeeList.toString();
  // var arr =[]
  // arr =str.split(',')
   console.log("UserDesignationEmployeeList split ", designation);


  }
  else
  console.log("Else in Callback "+childData);
}

menuchange(menuitem,i){
    this.setState({ CurComp: menuitem })
}

render(){
  
  return (
    <div>
    <div className="App" id="appid" >
  { ( this.state.UserDesignation !=='Manager' && this.state.Loggedin && this.state.UserDesignation !=='Delivery Manager'  )  &&    
      <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
        <h2 className="header-Text"> GTTS Consolidation <br/></h2>
        <img src={logo} className="App-logo" alt="logo" />
        
  {this.state.Loggedin &&  <button  id="submit" className="LogoutButton" value="Login" onClick={() => this.Logout()}>Logout </button>} 
  
      </header>
}
      { (this.state.UserDesignation ==='Manager' || this.state.UserDesignation ==='Delivery Manager' || !this.state.Loggedin ) &&    
        <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
          <h2 className="header-Text"> GTTS Consolidation <br/></h2>
          <img src={logo} className="App-logo" alt="logo" />
          
    {this.state.Loggedin &&  <button  id="submit" className="LogoutButton" value="Login" onClick={() => this.Logout()}>Logout </button>} 
    
        </header>
}

  {this.state.Loggedin &&   
  <div className="Menu" style={{display: this.state.UserDesignation ==='Manager' || this.state.UserDesignation ==='Delivery Manager'? 'set' :'none'}}>          
          <div className="menu-link" id="0" onClick={(e)=>this.menuchange(<GTTS  username={this.state.user_name} />,0,e)}> GTTS</div>
          <div className="menu-link" id="1" onClick={(e)=>this.menuchange(<EmployeeDetails />,1,e)}> Employee Details</div>
          <div className="menu-link" id="2" onClick={(e)=>this.menuchange(<UpdateEmployee />,2,e)}> Update Employee</div>
       </div>       }

      {/* Ternary operator */}

{this.state.Loggedin ? <div  className="App-body"> 
     { this.state.UserDesignation ==='Manager' || this.state.UserDesignation ==='Delivery Manager' ? this.state.CurComp :       <GTTS  username={this.state.user_name} /> }

</div> :
   <div  className="App-login-body"><Login parentCallback = {this.callbackFunction}/>   </div> }
    </div>
    </div>
  );
}
}
export default App;
