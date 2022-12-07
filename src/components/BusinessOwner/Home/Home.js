import React, { Component } from 'react';
import "./Home.css"
import axios from 'axios';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";


const { API_URL } = require('../../../config/config').default;

class Home extends Component {

    rentRobotsSuffix ='/robot/rent';
    getRobotsSuffix ='/robot/account';
    updateRobotStateSuffix = '/robot/state';
    updateConfigSuffix ='/robot/config';
    

    constructor(props) {
        super(props);
        this.state = {
            numR: 0,
            use_type: "",
            robots: [],
            robotId: "",
            selectedRobot: {},
            configShow: false,
            configDefaultStartTime: "",
            configDefaultEndTime: "",
            configDefaultType: ""

        }
    }

    componentDidMount() {
        console.log("Home:: componentDidMount()")
        var requestGetRobotsUrl = API_URL + this.getRobotsSuffix + "?accountId=" +localStorage.getItem('localAccountId');
        console.log(requestGetRobotsUrl);
        var token = localStorage.getItem('apiAuthToken');

        axios.get(requestGetRobotsUrl, 
            {
            headers: {
            'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            console.log(response.data);
            this.setState({ robots: response.data });
        }).catch(error => {
            this.setState({ errorMessage: error.message });
            console.log('There was an error: '+ this.state.errorMessage);
        });
    }

    handleTypeChange = (e) => {
        this.setState({
            use_type: e.target.value,
        });
    }

    handleRobotNums = (e) => {
        this.setState({
            numR: e.target.value
        })
        console.log(e.target.value);
    }

    handleRegisterRobot = (e) => {
        e.preventDefault();
        const {use_type, numR} = this.state;
        if (numR === 0) return;

        var token = localStorage.getItem('apiAuthToken');
        var localAccount = localStorage.getItem('localAccountId');

        this.requestUrl = API_URL + this.rentRobotsSuffix;

        axios.post(this.requestUrl, 
            {
                accountId : localAccount,
                type: 'rent',
                numRobots: numR
            },
            {
            headers: {
            'Authorization': `Bearer ${token}`
            }
        }).then(response => { 
            console.log("handleRegisterRobot SUCCESS");
            this.componentDidMount();
            
        }).catch(error => {
            this.setState({ errorMessage: error.message });
            console.log('There was an error: '+ this.state.errorMessage);
        });
    }

    requestRobotStateChange(newState, row) {
        var requestUrl = API_URL + this.updateRobotStateSuffix;
        var token = localStorage.getItem('apiAuthToken');
        axios.post(requestUrl, 
            {
                robotId : row.robotId,
                state: newState
            },
            {
            headers: {
            'Authorization': `Bearer ${token}`
            }
        }).then(response => { 
            console.log("requestRobotStateChange SUCCESS");
            this.componentDidMount();
            
        }).catch(error => {
            this.setState({ errorMessage: error.message });
            console.log('ERROR requestRobotStateChange'+ this.state.errorMessage);
        });
    }

    handleRobotEnabeld = (row) => { 
        if (row.state !== "ENABLED")
            this.requestRobotStateChange("RUNNING", row);
    }
    
    handleRobotPaused = (row) => { 
        if (row.state !== "PAUSED")
        this.requestRobotStateChange("PAUSED", row);
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

    handleTerminated = (e) => {
        e.preventDefault();
        this.requestRobotStateChange("TERMINATED", this.state.selectedRobot);
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
        return (
            <div>
                <h1>Rent a New Robot</h1>
                <div className="register__form">
                <form className="register_form" onSubmit={this.handleRegisterRobot}>
                    {/*<div className="radio">
                        <label><input type="radio" id="rent" value="rent" name="robot_type" checked={this.state.use_type==='rent'} onChange={this.handleTypeChange} /> rent</label>
                        <label><input type="radio" id="lease" value="lease" name="robot_type" checked={this.state.use_type==='lease'} onChange={this.handleTypeChange}/> lease</label>
                     </div>*/}
                    <div>
                        <label><input type="radio" checked="checked"/> rent</label>
                        <label>#Robots</label>
                        <input type="number" min="0" onChange={this.handleRobotNums} />
                        <button className='btn btn-light' type="submit">
                            <span>&nbsp;Submit&nbsp;</span>
                        </button>
                    </div>
                </form>
                </div>

                <h1>Managed Robots</h1>
                <div className='robot__table'>
                <Table>
                    <TableHead>
                    <TableRow>
                        <TableCell padding="default"><b>ID</b></TableCell>
                        <TableCell align="center"><b>State</b></TableCell>
                        <TableCell align="center"><b>Created At</b></TableCell>
                        <TableCell align="center"><b>Updated At</b></TableCell>
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
                                        data-item={robot} onClick={() => this.handleRobotEnabeld(robot)}>
                                        RESUME </button>
                                        : <p></p>
                                    }
                                    { (robot.state=="RUNNING")?
                                        <button className='robot__table__button' color="secondary" 
                                        data-item={robot} onClick={() => this.handleRobotPaused(robot)}>
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
                            onClick={() => this.handleRobotEnabeld(robot)}
                        >
                            ENABLED
                        </button>
                        </TableCell>
                        <TableCell align="right">
                        <button className='robot__table__button'
                            color="secondary"
                            data-item={robot}
                            onClick={() => this.handleRobotPaused(robot)}
                        >
                            PAUSED
                        </button>
                    </TableCell>*/}
                    </TableRow>
                    ])}
                </TableBody>
                </Table>
                </div>
                <div>
                    <button className='btn' onClick={this.handleConfigure}>Configure</button>
                    <button className='btn'onClick={this.handleTerminated}>Terminate</button>
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
        )
    }
}

export default Home;
