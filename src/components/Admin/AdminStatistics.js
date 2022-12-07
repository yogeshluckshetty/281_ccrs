import React, { Component } from 'react';
import axios from 'axios';
import "./AdminStatistics.css";
import { Bar } from "react-chartjs-2";
import { Chart, registerables  } from 'chart.js';
import { Pie } from 'react-chartjs-2';
Chart.register(...registerables);

const { API_URL } = require('../../config/config').default;

class AdminStatistics extends Component {

    getNumRobotsBusinessSuffix = '/business/robots';
    getRobotSuffix = '/robot/all';

    constructor(props) {
        super(props);
        this.state = {
            numRobotsBusiness: {},
            isNumRobotsBusiness: false,
            pieData:  {
                labels: [],
                datasets: [
                  {
                    label: 'Pie Chart Of Robot State',
                    data: [],
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                    ],
                    borderColor: [
                      'rgba(255, 99, 132, 1)',
                    ],
                    borderWidth: 1,
                  },
                ],
              }
        };
    }

    componentDidMount () {
        var requestUrl = API_URL + this.getNumRobotsBusinessSuffix;
        var token = localStorage.getItem('apiAuthToken');
        axios.get(requestUrl,
            {
            headers: {
            'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            console.log("getNumRobotsBusiness SUCCESS", response);
            this.setState({
                numRobotsBusiness: {
                    labels: response.data["keys"],
                    datasets: [
                      {
                        label: "Business Name vs Number of Robots",
                        data: response.data["values"],
                        backgroundColor: "#96AFC3"
                      }
                    ]
                },
                isNumRobotsBusiness: true
            });
        }).catch(error => {
            console.log("ERROR handleSearchSalesType");
            this.setState({ errorMessage: error.message });
        });

        this.getPieChart();
    }

    getPieChart() {
        var requestUrl = API_URL + this.getRobotSuffix;
        var token = localStorage.getItem('apiAuthToken');
        axios.get(requestUrl,
            {
            headers: {
            'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            console.log("getRobot SUCCESS", response);
            var statusmap = new Map();

            response.data.map((obj) => {
                if (statusmap.has(obj.state)) {
                    statusmap.set(obj.state,statusmap.get(obj.state)+1);
                }
                else {
                    statusmap.set(obj.state,1);
                }
            });
            console.log(statusmap);
            console.log();


            this.setState({
                pieData:  {
                    labels: Array.from(statusmap.keys()),
                    datasets: [
                      {
                        label: 'Pie Chart Of Robot State',
                        data: Array.from(statusmap.values()),
                        backgroundColor: [
                            '#DCA3C2',
                            '#C7CEF4',
                            '#D1A69B',
                            '#F5D788',
                            '#B5DCDD',
                        ],
                        borderColor: ['#FFFFFFFF'],
                        borderWidth: 1,
                      },
                    ],
                  }
            });
            
        }).catch(error => {
            console.log("ERROR handleSearchSalesType");
            this.setState({ errorMessage: error.message });
        });
    }

    render() {
        return (
            <div>
                <h1>Admin Statistics</h1>
                <div><h2>Robot Fleet Per Business</h2></div>
                { this.state.isNumRobotsBusiness? 
                    <div className='robots__business__bar'>
                        <Bar data={this.state.numRobotsBusiness}/>
                    </div>
                    : <div></div>
                } 
                <div> <h2>Robot Fleet State Breakdown</h2></div>
                { this.state.pieData? 
                    <div className='robot__state__pie'>
                        <Pie data={this.state.pieData} />
                    </div>
                    : <div></div>
                }
            </div>
        )
    }
}

export default AdminStatistics;
