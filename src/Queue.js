import React ,{Component} from 'react';

import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';


let Interval;
export default class Queue extends Component{

    constructor(props){
        super(props);
        this.state={
            displayQueue:""
        }

    }

    
componentDidMount(){

    Interval = setInterval(() => {

        this.handleQueue()
        console.log("called");
        
         
       }, 5000);
}
      
async handleQueue ( ){
    console.log("queue");
    let queue = await axios.get('http://localhost:8002/Addqueue');
    this.setState({displayQueue:queue.data });
    console.log(queue);
    
  }

  componentWillUnmount(){
      clearInterval(Interval);
  }

 render(){
     console.log("render");
     
    return(

        <div>
            
                        <div style= {{
                                        borderBottom:"1px solid #ffff ",
                                        color:"#282c34",
                                        marginBottom:"10px",
                                        marginTop:"10px"
                                        }}>
                                        <b> Queue ({this.state.displayQueue.length})</b>
                        </div>
                       <table className="table-hover" >
                           <tbody>
                            {this.state.displayQueue   && this.state.displayQueue.map(que => 
                            <tr >
                                        <td style={{textAlign:"center"}} onClick={() => this.props.onClick(que.empid)}>{que.empid}</td>
                                        <td style={{textAlign:"center"}} onClick={() => this.props.onClick(que.empid)}>{que.empName}</td>
                                        <td style={{textAlign:"center"}}> <button className="btn btn-link btn-sm"  onClick={() => this.props.hold(que.empid)}>Hold</button></td>
                            </tr>)}
                            </tbody>
                       </table>

                   
        </div>
    )
}
}