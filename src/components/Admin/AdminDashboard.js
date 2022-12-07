import React, { Component } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';
import AdminLeftSidebar from './AdminLeftSidebar';
import './AdminDashboard.css';

const { API_URL } = require('../../config/config').default;

class AdminDashboard extends Component {

    constructor(props){
        super(props);

        this.state = {
            unauthorizedError: false,
        };
    }

    componentDidMount(){
    }

    handleLogout = (e) => {
        localStorage.removeItem('apiAuthToken');
        localStorage.removeItem('localUserId');
        this.setState({
            unauthorizedError: true
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
            <div className="admindashboard">
                {redirect}
                <div className = "admindashboard__header">
                    <div className="ccrs">
                        Coffee making robot system
                    </div>
                    <div className="admindashboard__logout">
                        <button className='btn__logout' onClick={this.handleLogout}>Logout</button>
                    </div>
                </div>

                <div className="admindashboard__main">
                    <div className="admindashboard__leftsidebar">
                        <AdminLeftSidebar />
                    </div>
                    <div className="admindashboard__currentpage">
                        {currentPage}
                    </div>
                </div>
            </div>
        )
    }
}

export default AdminDashboard;
