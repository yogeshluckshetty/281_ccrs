import React, { Component } from 'react';
import axios from 'axios';
import './Orders.css';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const { API_URL } = require('../../../config/config').default;

class Orders extends Component {
    getOrdersSuffix = '/business/allorders';

    constructor(props) {
        super(props);
        this.state = {
            orders:[],
        };
    }

    componentDidMount() {
        console.log("componentDidMount()")
        var requestUrl = API_URL + this.getOrdersSuffix + "?accountId=" +localStorage.getItem('localAccountId');

        console.log(requestUrl);
        var token = localStorage.getItem('apiAuthToken');

        axios.get(requestUrl, 
            {
            headers: {
            'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            console.log(response.data);
            this.setState({ orders: response.data });
        }).catch(error => {
            this.setState({ errorMessage: error.message });
            console.log('Error :'+ this.state.errorMessage);
        });
    }

    render() {
        return (
            <div>
                <h1> Orders </h1>
                <div className='order__table'>
                <Table>
                    <TableHead>
                    <TableRow>
                        <TableCell padding="default"><b>Order ID</b></TableCell>
                        <TableCell padding="default"><b>Robot ID</b></TableCell>
                        <TableCell align="right"><b>Coffee</b></TableCell>
                        <TableCell align="right"><b>Size</b></TableCell>
                        <TableCell align="right"><b>Date</b></TableCell>
                    </TableRow>
                    </TableHead>
                <TableBody>
                    {this.state.orders.map((order) => [
                    <TableRow key={order.orderId}>
                        <TableCell padding="default">{order.orderId}</TableCell>
                        <TableCell padding="default">{order.robotId}</TableCell>
                        <TableCell align="right">{order.coffeeType}</TableCell>
                        <TableCell padding="default">{order.coffeeSize}</TableCell>
                        <TableCell align="right">{order.orderDate}</TableCell>
                    </TableRow>
                    ])}
                </TableBody>
                </Table>
                </div>
            
            </div>
        )
    }
}

export default Orders;
