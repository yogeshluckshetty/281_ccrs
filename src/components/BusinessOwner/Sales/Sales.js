import React, { Component } from 'react';
import axios from 'axios';
import "./Sales.css"
import { Bar } from "react-chartjs-2";
import { Chart, registerables  } from 'chart.js';
Chart.register(...registerables);

const { API_URL } = require('../../../config/config').default;

class Sales extends Component {
    salesCoffeeTypeSuffix = "/business/salesbytype";
    salesRobotsSuffix = "/business/salesbyrobot";

    constructor(props) {
        super(props);
        this.state = {
            ct_start : "",
            ct_end : "",
            isCT : false,
            coffeeType : {},
            sr_date: "",
            isSR: false,
            numSalesRobots: {},
        };
    }

    handleCTStartChanged = (e) => {
        this.setState({
            ct_start: e.target.value,
        });
    }

    handleCTEndChanged = (e) => {
        this.setState({
            ct_end: e.target.value,
        });
    }

    requestSalesType = (e) => {
        e.preventDefault();
        const { ct_start, ct_end } = this.state;
        var token = localStorage.getItem('apiAuthToken');
        var account = localStorage.getItem('localAccountId');
        var requestUrl = API_URL + this.salesCoffeeTypeSuffix+"?accountId="+ account+"&startDate="+ct_start+"&endDate="+ct_end;
        console.log("requestSalesType")
        axios.get(requestUrl,
            {
            headers: {
            'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            console.log("requestSalesType SUCCESS", response);
            this.setState({
                isCT: true,
                coffeeType: {
                    labels: response.data["keys"],
                    datasets: [
                      {
                        label: "total coffee sales",
                        data: response.data["values"],
                        backgroundColor: "#be7656"
                      }
                    ]
                }
            });
        }).catch(error => {
            console.log("ERROR handleSearchSalesType");
            this.setState({ errorMessage: error.message });
        });
    }

    handleSRDateChanged = (e) => {
        this.setState({
            sr_date: e.target.value,
        });
        console.log("Date Selected", e.target.value);
    }

    requestSalesRobots = (e) => {
        e.preventDefault();
        const { sr_date } = this.state;
        var token = localStorage.getItem('apiAuthToken');
        var account = localStorage.getItem('localAccountId');

        var requestUrl = API_URL + this.salesRobotsSuffix+"?accountId="+account+"&date="+sr_date;

        console.log("requestSalesRobots:::", sr_date);
        axios.get(requestUrl,
            {
            headers: {
            'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            console.log("requestSalesRobots SUCCESS", response);
            this.setState({
                isSR: true,
                numSalesRobots : {
                    labels: response.data["keys"],
                    datasets: [
                      {
                        label: "Total Sales By Robots",
                        data: response.data["values"],
                        backgroundColor: "#efc4a4"
                      }
                    ]
                }
            });
        }).catch(error => {
            console.log("ERROR requestSalesRobots");
            this.setState({ errorMessage: error.message });
        });
    }
      
    render() {
        return (
            <div>
                <div>
                    <h1>Coffee Sales Dashboard</h1>
                </div>

                <div className="stics__type">
                    <h2>Total Sales by Coffee Types:</h2>
                    <form onSubmit={this.requestSalesType}>
                        <label htmlFor="start">Start</label>
                        <input type="date" onChange={this.handleCTStartChanged} />
                        <label htmlFor="end">End</label>
                        <input type="date" onChange={this.handleCTEndChanged} />
                        <button className='btn' type="submit"> Search </button>
                     </form>
                    { this.state.isCT ? 
                    <div className='bar__graph'><Bar data={this.state.coffeeType} /></div>
                    : <p/>
                    }
                </div>

                <div className="stics__robots">
                    <h2>Total Sales by Robots</h2>
                    <form onSubmit={this.requestSalesRobots}>
                        <label>Date</label>
                        <input type="date" onChange={this.handleSRDateChanged} />
                        <button className='btn' type="submit"> Search </button>
                     </form>
                    { this.state.isSR ? 
                    <div className='bar__graph'><Bar data={this.state.numSalesRobots} /></div>
                    : <p/>
                    }
                </div>


                
                
            </div>
        )
    }
}

export default Sales;
