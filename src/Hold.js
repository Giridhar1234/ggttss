import React ,{Component} from 'react';
import './EmployeeDetails.css';
import axios from 'axios';


let Interval;
export default class Queue extends Component{

    constructor(props){
        
        
        super(props);
        this.state={
            queueList:[],
            quedisp:false,
            
        }

    }

    async componentDidMount(){

       console.log("called2");
       let queue = await axios.get('http://localhost:8002/getHoldArray');
       console.log(queue);
       this.setState({queueList: queue.data});
         
       }
       
async componentWillReceiveProps(){

    let queue = await axios.get('http://localhost:8002/getHoldArray');
    console.log(queue);
    
    this.setState({queueList: queue.data});
 
}


      

 render(){
     
     
    return(

        <div>
            
                        <div style= {{
                                        borderBottom:"1px solid #ffff ",
                                        color:"#282c34",
                                        marginBottom:"10px",
                                        marginTop:"10px"
                                        }}>
                                        <b> On hold ({this.state.queueList.length})</b>
                        </div>
                       <table className="table-hover">
                           <tbody>
                            {this.state.queueList && this.state.queueList.map(que => 
                            <tr >
                                        <td style={{textAlign:"center"}} onClick={() => this.props.onClick(que.empid)}>{que.empid}</td>
                                        <td style={{textAlign:"center"}} onClick={() => this.props.onClick(que.empid)}>{que.empName}</td>
                                        <td style={{textAlign:"center"}}> <button className="btn btn-link btn-sm"  onClick={() => this.props.unhold(que.empid)}>Unhold</button></td>
                            </tr>)}
                            </tbody>
                       </table>

                   
        </div>
    )
}
}