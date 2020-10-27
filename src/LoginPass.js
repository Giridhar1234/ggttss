import React from 'react';
import Axios from 'axios';

import loginimg from './images/login-img.jpg';
import './Login.css';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { errormsg:'',
                        sucessmsg:'',
                    }
         }

         
         
    componentDidMount(){
        this.loginpopup();

    }
    loginpopup(){
        document.getElementById('LoginPopup').style.display='block';
    }

    validateUser(){
       
            let username = document.getElementById("username").value;
            let password = document.getElementById("password").value;
            var result;
            let formdata =new FormData();
            formdata.append('user_name',username);
            formdata.append('user_pwd',password);
           
            Axios.post("http://10.33.105.106:8000/user_validate",formdata)
            .then(res=>{console.log(res.statusText)
            result =res.data;
            //this.sendData(username);
            if(result===1){
                sessionStorage.setItem("loaded",true)
                this.sendData(username);
                this.setState({errormsg:''})
            }
            else
            {
                this.setState({errormsg:result})
                document.getElementById("username").value ='';
                document.getElementById("password").value ='';
              
            }
        })
    }
    sendData = (username) => {
        this.props.parentCallback("true",username);
        console.log("to_parent")
      }


    render() { 
        return ( 
        <div id="LoginPopup"  className="login-wrapper">
            
    

           <div className="Login-box row">
                                    <div className="login-img col-sm-6 col-md-6 col-lg-6">
                            <img src={loginimg} className="login-img-tag" alt={"hi"} />
                    </div>
                <table className="login col-sm-6 col-md-6 col-lg-6">
                    <tr>
                        <input className="input100" type="text"name="username" id="username" title="Enter User Name" placeholder="Enter UserName"/>
                    </tr>
                    <tr><input type="password" className="input100" name="password" id="password" placeholder="Enter Password" /> </tr>
                    <tr><button  id="submit" value="Login" onClick={(e) => this.validateUser(e)}>Login </button></tr>
                    <tr><span style={{color:"red"}} > {this.state.errormsg} </span></tr>
                </table>

            </div > 
            
 

         
    </div> );
    }
}




