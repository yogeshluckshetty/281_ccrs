import React, { Component } from 'react';
import "./Invoice.css";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Bar } from "react-chartjs-2";
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables); 


const { API_URL } = require('../../../config/config').default;

class Invoice extends Component {

    searchInvoiceAPI = "/invoice/byduedate";
    payInvoiceSuffix = '/invoice/pay';

    constructor(props) {
        super(props);
        this.state = {
            startDate : "",
            endDate : "",
            isInvoice : false,
            invoice_list : [],
            invoiceInfo: {},
            selectedInvoiceId:"",
            selectedPaidAmount:0,
            key: [],
            value: [],
            isPay: false,
        };
    }

    handleStartDateChanged = (e) => { 
      console.log(e.target.value);
        this.setState({
            startDate: e.target.value,
        });
        console.log(this.state.startDate);
    }
    handleEndDateChanged = (e) => {
      console.log(e.target.value);
      this.setState({
        endDate: e.target.value,
      }); 
    }

    handleSelectInvoice = (e) => {
      console.log("handleSelectInvoice");
      console.log(e.target.value);
      console.log(e.target.type);
      console.log(this.state.invoice_list);

      this.result = this.state.invoice_list.find((invoice) => invoice.invoiceId == e.target.value);      
      this.setState({
        selectedInvoiceId: e.target.value,
        selectedPaidAmount: this.result.amountDue,
      });
    }



  handleSearchInvoice  = (e) => {
    e.preventDefault();
    const { startDate, endDate } = this.state;
    console.log("handleSearchInvoice()");

    var requestUrl = API_URL + this.searchInvoiceAPI+ "?accountId=" + localStorage.getItem('localAccountId') +
                      "&endDate=" + endDate + "&startDate=" + startDate;

    console.log(requestUrl);

    var token = localStorage.getItem('apiAuthToken');
    axios.get(requestUrl, 
        {
        headers: {
        'Authorization': `Bearer ${token}`
        }
    }).then(response => {
        console.log("handleSearchInvoice() SUCCESS");
        this.setState({
          invoice_list: response.data,          
        });
        this.state.key = [];
        this.state.value = [];
        response.data.map((obj) => {
            if (obj.status=='OPEN') {
              this.state.key.push(obj.invoiceId);
              this.state.value.push(obj.amountDue);
            }
          }
        );
        console.log(this.state.key);
        console.log(this.state.value);
        this.state.invoiceInfo = {
          labels: this.state.key,
          datasets: [
            {
              label: "invoices",
              data: this.state.value,
              backgroundColor: "#3e60cf"
            }
          ]
      }
      this.setState({
        isInvoice: true
      });
    }).catch(error => {
        this.setState({ errorMessage: error.message });
        console.log('There was an error: '+ this.state.errorMessage);
    });
  }

  handlePayInvoice  = (e) => {
    e.preventDefault();
    console.log("handlePayInvoice()");
    var requestUrl = API_URL + this.payInvoiceSuffix;
    var token = localStorage.getItem('apiAuthToken');
    var account = localStorage.getItem('localAccountId');

    console.log("account ", account);
    console.log(this.state.selectedInvoiceId, this.state.selectedPaidAmount);
    axios.post(requestUrl, 
        {
            invoiceId: this.state.selectedInvoiceId,
            accountId: account,
            paidAmount: this.state.selectedPaidAmount,
        },
        {
        headers: {
        'Authorization': `Bearer ${token}`
        }
    }).then(response => {
        console.log("handlePayInvoice() SUCCESS");
        this.setState({
          isPay : true
        });
    }).catch(error => {
        this.setState({ errorMessage: error.message });
        console.log('There was an error: '+ this.state.errorMessage);
    });

  }

    render() {
      console.log("Invoice render()");
    
      const date = new Date();
      const futureDate = date.getDate() + 3;
      date.setDate(futureDate);
      var defaultDate = date.toLocaleDateString('en-CA');

        return (
            <div>
                <div>
                    <h1>Invoice </h1>
                </div>

                <div>
                    <form onSubmit={this.handleSearchInvoice}>
                        <label htmlFor="start"><b>Start Due Date</b></label>
                        <input type="date" onChange={this.handleStartDateChanged} defaultValue={defaultDate}/>
                        &nbsp;&nbsp;<label htmlFor="start"><span><b>End Due Date</b></span></label>
                        <input type="date" onChange={this.handleEndDateChanged} defaultValue={defaultDate}/>
                        <button className='btn' type="submit"> Search </button>
                     </form>
                </div>

                { this.state.isInvoice ? 
                <div>
                    <div className='bar__graph'>
                      <Bar data={this.state.invoiceInfo} />
                      <div className='invoice__table'>
                      <Table>
                          <TableHead>
                          <TableRow>
                              <TableCell padding="default"><b>Invoice ID</b></TableCell>
                              <TableCell align="right"><b>Issued At</b></TableCell>
                              <TableCell align="right"><b>Due Date</b></TableCell>
                              <TableCell align="right"><b>Amount</b></TableCell>
                              <TableCell align="right"><b>Status</b></TableCell>
                          </TableRow>
                          </TableHead>
                      <TableBody>
                          {this.state.invoice_list.map((invoice) => [
                          <TableRow key={invoice.invoiceId}>
                              <TableCell padding="default">{invoice.invoiceId}</TableCell> 
                              <TableCell padding="default">{invoice.issuedAt}</TableCell> 
                              <TableCell padding="default">{invoice.dueDate}</TableCell> 
                              <TableCell padding="default">{invoice.amountDue}</TableCell> 
                              <TableCell padding="default">{invoice.status}</TableCell> 
                          </TableRow>
                          ])}
                      </TableBody>
                      </Table>
                  </div>
                  </div>

                    <div>
                        <label> Invoice ID </label>
                        <input type="text" onChange={this.handleSelectInvoice} />
                        <button className='btn' onClick={this.handlePayInvoice}><span>Pay</span></button> 
                    </div>
              </div>
                    : <p/>
                }
            </div>
        )
    }
}

export default Invoice;
