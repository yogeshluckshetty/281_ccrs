import React, { Component } from 'react';
import axios from 'axios';
import "./AdminHome.css";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const { API_URL } = require('../../config/config').default;




class AdminHome extends Component {
    getAccountsSuffix ='/account/all';
    getRobotsSuffix ='/robot/account';
    updateRobotStateSuffix = '/robot/state';
    rentRobotsSuffix = '/robot/rent';
    updateConfigSuffix ='/robot/config';

    constructor(props) {
        super(props);
        this.state = {
            robots:[],
            business_list:[],
            selectedBusinessName : "",
            selectedBusinessId : "",
            selectedBusinessAddress: "",
            selectedBusiness: false,
            selectedRobot: {},
            configShow: false,
            configCoffeeType: "",
            configStartTime: "",
            configEndTime: "",
            configDefaultType:"",
            configDefaultStartTime:"",
            configDefaultEndTime:""
        };
    }
    componentDidMount() {
        console.log("componentDidMount()");
        var token = localStorage.getItem('apiAuthToken');
        //get all accounts:
        axios.get(
            API_URL + this.getAccountsSuffix,
            {
                headers: {
                'Authorization': `Bearer ${token}`
                }
            }
          ).then(response=> {
            console.log("GetAccounts SUCCESS", response.data);
            this.setState({business_list: response.data});
          }).catch(error=> {
            console.log("ERROR GetAccounts: ", error.message);
          });
    }

    handleBusinessChange = (e) => {
        e.preventDefault();
        console.log("handleBusinessChange()");
        this.result = this.state.business_list.find((business) => business.businessName === e.target.value);
        console.log("selected:", this.result.address, this.result.city);
        this.getRobots(this.result.accountId);
        this.setState({
            selectedBusinessName : e.target.value,
            selectedBusinessId : this.result.accountId,
            selectedBusinessAddress: this.result.address+ ", " + this.result.city + ", " + this.result.state + ", " + this.result.zip,
            selectedBusiness: true
        });
    }

    handleCreated = (e) => {
        e.preventDefault();
        console.log("request to create new robots");
        var token = localStorage.getItem('apiAuthToken');
        this.requestUrl = API_URL + this.rentRobotsSuffix;

        axios.post(this.requestUrl, 
            {
                accountId : this.state.selectedBusinessId,
                type: 'rent',
                numRobots: 1
            },
            {
            headers: {
            'Authorization': `Bearer ${token}`
            }
        }).then(response => { 
            console.log("handleRegisterRobot SUCCESS");
            this.getRobots(this.state.selectedBusinessId);
            
        }).catch(error => {
            this.setState({ errorMessage: error.message });
            console.log('There was an error: '+ this.state.errorMessage);
        });
    }

    getRobots(accountId) {
        console.log("getRobots()");
        var token = localStorage.getItem('apiAuthToken');
        var requestGetRobotsUrl = API_URL + this.getRobotsSuffix +"?accountId=" +accountId;
        console.log(requestGetRobotsUrl);
        
        axios.get(requestGetRobotsUrl, 
            {
            headers: {
            'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            console.log("Get Robots SUCCESS ", response.data);
            this.setState({ robots: response.data });
        }).catch(error => {
            this.setState({ errorMessage: error.message });
            console.log('There was an error: '+ this.state.errorMessage);
        });
    }

    handleRobotState = (robot, newState) => { 
        if (robot.state === newState) return;
        var requestUrl = API_URL + this.updateRobotStateSuffix;
        var token = localStorage.getItem('apiAuthToken');
        axios.post(requestUrl, 
            {
                robotId : robot.robotId,
                state: newState
            },
            {
            headers: {
            'Authorization': `Bearer ${token}`
            }
        }).then(response => { 
            this.getRobots(this.state.selectedBusinessId);
            
        }).catch(error => {
            this.setState({ errorMessage: error.message });
            console.log('ERROR robbotState '+ this.state.errorMessage);
        });
    }

    handleSelctedRobot = (rob) => {
        console.log("handle Selected Button", rob);
        this.setState({ 
            selectedRobot: rob,
            configShow: false,
            configDefaultStartTime: "",
            configDefaultEndTime: "",
            configDefaultType: ""
        });
    }

    handleTerminated = (e) => {
        e.preventDefault();
        this.handleRobotState(this.state.selectedRobot, "TERMINATED");
    }

    handleConfigure = (e) =>{
        e.preventDefault();
        console.log("configuration", this.state.selectedRobot.robotId);
        if (this.state.selectedRobot.robotId==null) return;
        if (this.state.selectedRobot.state=="TERMINATED") return;
        var token = localStorage.getItem('apiAuthToken');
        axios.get(
            API_URL + this.updateConfigSuffix +"?robotId="+this.state.selectedRobot.robotId,
            {
                headers: {
                'Authorization': `Bearer ${token}`
                }
            }
          ).then(response=> {
            console.log("GET configuration SUCCESS", response.data);
            this.setState({
                configDefaultType: response.data["robot.coffee.type"],
                configDefaultStartTime: response.data["robot.start_time"],
                configDefaultEndTime: response.data["robot.end_time"]
            });
          }).catch(error=> {
            console.log("ERROR configuration: ", error.message);
          });
          this.setState({ configShow: true });
    }

    handleConfigureCoffee = (e) => {
        e.preventDefault();
        console.log("configuration", e.target.value);
        this.setState({ 
            configDefaultType: e.target.value,
        });
    }

    handleConfigureStart =(e) =>{
        e.preventDefault();
        console.log("handleConfigureStart", e.target.value);
        this.setState({
            configDefaultStartTime: e.target.value
        });
    }

    handleConfigureEnd =(e) =>{
        e.preventDefault();
        console.log("handleConfigureEnd", e.target.value);
        this.setState({ 
            configDefaultEndTime: e.target.value
        });
    }

    updateConfig = (e) =>{
        e.preventDefault();
        console.log("updateConfig");
        if (this.state.configStartTime>this.state.configEndTime) return;

        var requestUrl = API_URL + this.updateConfigSuffix;
        var token = localStorage.getItem('apiAuthToken');

        axios.post(requestUrl,
            {
                robotId: this.state.selectedRobot.robotId,
                configMap: {
                    "robot.coffee.type": this.state.configDefaultType,
                    "robot.end_time": this.state.configDefaultEndTime,
                    "robot.start_time": this.state.configDefaultStartTime
                  }
            },
            {
            headers: {
            'Authorization': `Bearer ${token}`
            }
        }).then(response => { 
            console.log("updateConfig SUCCESS");
            this.setState({
                configShow: false,
                configDefaultStartTime: "",
                configDefaultEndTime: "",
                configDefaultType: ""
            });
            
        }).catch(error => {
            this.setState({ errorMessage: error.message });
            console.log('There was an error: '+ this.state.errorMessage);
        });
        
    }

    render() {
        console.log("render()", this.state.selectedBusiness);
        console.log("configShow", this.state.configShow);

        return (
            <div>
                <div><h1> Admin Dashboard </h1></div>
                <div>
                    <label className='order__label'>Business List:</label>
                    <input className='order__input' list="location" onChange={this.handleBusinessChange} />
                        <datalist id="location">
                            {this.state.business_list ?
                                this.state.business_list.map((business)=> [
                                        <option key={business.accountId} value={business.businessName} />
                                ]):
                                <option value="No available" />
                            }
                        </datalist>
                </div>

                { this.state.selectedBusiness? 
                <div>
                    <div>
			<h3>{this.state.selectedBusinessName}</h3>
                        <br/><b>Business ID:</b> {this.state.selectedBusinessId}<br/>
                        <b>Business Address:</b> {this.state.selectedBusinessAddress}<br/>
                    </div>
                    <div className='robot__table'>
                        <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="left"><b>Robot ID</b></TableCell>
                                <TableCell align="center"><b>State</b></TableCell>
                                <TableCell align="center"><b>Created At</b></TableCell>
                                <TableCell align="center"><b>Updated At</b></TableCell>
                                {/*<TableCell align="right">ENABLED</TableCell>
                                <TableCell align="right">PAUSED</TableCell>
                <TableCell align="right">TERMINATED</TableCell>*/}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.robots.map((robot) => [
                            <TableRow key={robot.robotId}>
                                <TableCell align="left">
                                    <input type="checkbox"  
                                    checked={this.state.selectedRobot.robotId===robot.robotId}
                                    onClick={() => this.handleSelctedRobot(robot)}/>
                                    &nbsp;{robot.robotId}
                                </TableCell>
                                <TableCell align="center">
                                    {robot.state}
                                    <div>
                                    { (robot.state=="PAUSED")?
                                        <button className='robot__table__button' color="secondary" 
                                        data-item={robot} onClick={() => this.handleRobotState(robot,"RUNNING")}>
                                        RESUME </button>
                                        : <p></p>
                                    }
                                    { (robot.state=="RUNNING")?
                                        <button className='robot__table__button' color="secondary" 
                                        data-item={robot} onClick={() => this.handleRobotState(robot,"PAUSED")}>
                                        PAUSE </button>
                                        : <p></p>
                                    }</div>
                                </TableCell>
                                <TableCell align="center">{robot.createdAt}</TableCell>
                                <TableCell align="center">{robot.updatedAt}</TableCell>
                                {/*<TableCell align="right">
                                <button className='robot__table__button'
                                    color="secondary"
                                    data-item={robot}
                                    onClick={() => this.handleRobotState(robot, "ENABLED")}
                                >
                                    ENABLED
                                </button>
                                </TableCell>
                                <TableCell align="right">
                                <button className='robot__table__button'
                                    color="secondary"
                                    data-item={robot}
                                    onClick={() => this.handleRobotState(robot, "PAUSED")}
                                >
                                    PAUSED
                                </button>
                                </TableCell>
                                <TableCell align="right">
                                <button className='robot__table__button'
                                    color="secondary"
                                    data-item={robot}
                                    onClick={() => this.handleRobotState(robot, "TERMINATED")}
                                >
                                    TERMINATED
                                </button>
                                </TableCell>*/}
                            </TableRow>
                            ])}
                        </TableBody>
                        </Table>
                    </div>
                    <div>
                    <button className='btn' onClick={this.handleCreated}> Rent Robot </button>
                    <button className='btn' onClick={this.handleConfigure}>Configure Robot</button>
                    <button className='btn'onClick={this.handleTerminated}>Terminate Robot</button>
                    { this.state.configShow? 
                        <div> <h3>Configuration</h3>
                            <div className='config__box'>
                                <div id="config__coffee__type">
                                    <label>Coffee Job</label>
                                    <label><input type="radio" value="1" name="config__coffee__type" checked={this.state.configDefaultType=="1"} onChange={this.handleConfigureCoffee}/>Americano</label>
                                    <label><input type="radio" value="2" name="config__coffee__type" checked={this.state.configDefaultType=="2"} onChange={this.handleConfigureCoffee}/>Espresso</label>
                                    <label><input type="radio" value="3" name="config__coffee__type"checked={this.state.configDefaultType=="3"} onChange={this.handleConfigureCoffee}/>Capuccino</label>
                                </div>
                                <div id="config__coffee__time">
                                    <label>Start Time <input type="time" name="config__coffee__time" value={this.state.configDefaultStartTime} onChange={this.handleConfigureStart}/></label>
                                    <label>End Time <input type="time" name="config__coffee__time" value={this.state.configDefaultEndTime} onChange={this.handleConfigureEnd}/></label>
                                    <button className='btn' onClick={this.updateConfig}>Update</button>
                                </div>
                            </div>

                        </div>
                    : <p></p> 
                    }
                    </div>
                </div>

                : <div></div>}

                
            
            </div>
        )
    }
}

export default AdminHome;
