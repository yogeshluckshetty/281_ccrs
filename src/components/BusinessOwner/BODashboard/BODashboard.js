import React, { Component } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';
import LeftSidebar from '../LeftSidebar/LeftSidebar';
import './BODashboard.css';

const { API_URL } = require('../../../config/config').default;

class BODashboard extends Component {

    constructor(props){
        super(props);

        this.state = {
            unauthorizedError: false,
            business_account: ""
        };
    }

    componentDidMount(){
        this.setState({ business_account: localStorage.getItem('localAccountId') })
    }

    handleLogout = (e) => {
        localStorage.removeItem('apiAuthToken');
        localStorage.removeItem('localUserId');
        localStorage.removeItem('localAccountId');
        this.setState({
            unauthorizedError: true,
            business_account: ""
        })
    }

    render() {
        //If not logged in, redirect to login page
        let redirect = (<div></div>);
        if(this.state.unauthorizedError){
            redirect = (
                <Redirect to="/login" />
            );
        }
        const { currentPage } = this.props;

        return (
            <div className="bodashboard">
                {redirect}
                <div className = "bodashboard__header">
                    <div className="ccrs">
                        Coffee making robot system
                    </div>
                    <div className="customerdashboard__usergreeting">
                        <span className="bodashboard__usergreeting"> Business Account: </span>
                        <span className="customerdashboard__user">{this.state.business_account}</span>
                    </div>
                    <div className="bodashboard__logout">
                        <button className='btn__logout' onClick={this.handleLogout}>Logout</button>
                    </div>
                </div>

                <div className="bodashboard__main">
                    <div className="bodashboard__leftsidebar">
                        <LeftSidebar />
                    </div>
                    <div className="bodashboard__currentpage">
                        {currentPage}
                    </div>
                </div>
            </div>
        )
    }
}

export default BODashboard;
