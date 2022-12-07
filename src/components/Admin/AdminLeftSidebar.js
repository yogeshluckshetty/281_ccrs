import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './AdminLeftSidebar.css';

class AdminLeftSidebar extends Component {
    render() {
        return (
            <div className="adminleftsidebar">
                <Link to="/adminhome">
                    <div className="adminleftsidebar__tab">
                        <span>Home</span>
                    </div>
                </Link>

                <Link to="/adminstatistics">
                    <div className="adminleftsidebar__tab">
                        <span>Statistics</span>
                    </div>
                </Link>

                <Link to="/admininvoice">
                    <div className="adminleftsidebar__tab">
                        <span>Invoice</span>
                    </div>
                </Link>

                <Link to="/adminnavigation">
                    <div className="adminleftsidebar__tab">
                        <span>Robot Controls</span>
                    </div>
                </Link>

            </div>
        )
    }
}

export default AdminLeftSidebar;
