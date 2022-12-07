import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './LeftSidebar.css';

class LeftSidebar extends Component {
    render() {
        return (
            <div className="leftsidebar">
                <Link to="/dashboard">
                    <div className="leftsidebar__tab">
                        <span>Robots</span>
                    </div>
                </Link>

                <Link to="/robotusage">
                    <div className="leftsidebar__tab">
                        <span>Robot Usage</span>
                    </div>
                </Link>

                <Link to="/invoice">
                    <div className="leftsidebar__tab">
                        <span>Invoice</span>
                    </div>
                </Link>

                <Link to="/sales">
                    <div className="leftsidebar__tab">
                        <span>Sales</span>
                    </div>
                </Link>
                
                <Link to="/orders">
                    <div className="leftsidebar__tab">
                        <span>Orders</span>
                    </div>
                </Link>

                <Link to="/navigation">
                    <div className="leftsidebar__tab">
                        <span>Robot Controls</span>
                    </div>
                </Link>



            </div>
        )
    }
}

export default LeftSidebar;
