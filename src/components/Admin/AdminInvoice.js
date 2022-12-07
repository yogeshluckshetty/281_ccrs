import React, { Component } from 'react';
import axios from 'axios';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const { API_URL } = require('../../config/config').default;

class AdminInvoice extends Component {

    getAccountsSuffix ='/account/all';
    requestInvoiceSuffix = '/invoice/generate';
    getAllInvoiceSuffix = '/invoice/all';

    constructor(props) {
        super(props);
        this.state = {
            selectedStartDate: "",
            selectedEndDate: "",
            business_list:[],
            selectedBusinessId : "",
            selectedBusinessAddress: "",
            selectedBusiness: false,
            selectedBusinessName: false,
            invoice_list:[],
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
            this.setState({business_list: response.data});
          }).catch(error=> {
            console.log("ERROR Business Name List", error.message);
          });
    }

    handleBusinessChange = (e) => {
        e.preventDefault();
        if (e.target.value==='') return;

        console.log("handleBusinessChange()");
        this.result = this.state.business_list.find((business) => business.businessName === e.target.value);
        console.log("account id ", this.result.accountId);
        this.setState({
            selectedBusinessName : e.target.value,
            selectedBusinessId : this.result.accountId,
            selectedBusinessAddress: this.result.address+ ", " + this.result.city + ", " + this.result.state + ", " + this.result.zip,
            selectedBusiness: true
        });
        console.log(this.state.selectedBusinessId);
        this.getAllInvoices(this.result.accountId);
    }

    handleStartDateChange = (e) => {
        e.preventDefault();
        this.setState({
            selectedStartDate: e.target.value
        })
        console.log(e.target.value);
    }

    handleEndDateChange = (e) => {
        e.preventDefault();
        this.setState({
            selectedEndDate: e.target.value
        })
        console.log(e.target.value);
    }

    requestInvoice = (e) => {
        console.log("requestInvoice()");
        var requestUrl = API_URL + this.requestInvoiceSuffix;
        var token = localStorage.getItem('apiAuthToken');

        axios.post(requestUrl, 
            {
                accountId: this.state.selectedBusinessId,
                startDate: this.state.selectedStartDate,
                endDate: this.state.selectedEndDate
            },
            {
            headers: {
            'Authorization': `Bearer ${token}`
            }
        }).then(response => {  
            console.log("requestInvoice SUCCESS");

            this.getAllInvoices(this.state.selectedBusinessId);            
        }).catch(error => {
            this.setState({ errorMessage: error.message });
            console.log('ERROR requestInvoice'+ this.state.errorMessage);
        });
    }

    /*getAllInvoices() {
        console.log("getAllInvoices()");
        var account = this.state.selectedBusinessId;
        console.log(account);
        var token = localStorage.getItem('apiAuthToken');
        var requestUrl = API_URL + this.getAllInvoiceSuffix+ "?accountId=" + account;
        console.log("requestUrl ", requestUrl);

        //get all invoices at account Id:
        axios.get(requestUrl,
            {
                headers: {
                'Authorization': `Bearer ${token}`
                }
            }
          ).then(response=> {
            console.log("getAllInvoices() SUCCESS");
            console.log(response.data);            
            this.setState({invoice_list: response.data});
          }).catch(error=> {
            console.log("ERROR Business Name List", error.message);
          });
    }*/

    getAllInvoices(id) {
        console.log("getAllInvoices(id)");
        var token = localStorage.getItem('apiAuthToken');
        var requestUrl = API_URL + this.getAllInvoiceSuffix+ "?accountId=" + id;
        console.log("requestUrl ", requestUrl);

        //get all invoices at account Id:
        axios.get(requestUrl,
            {
                headers: {
                'Authorization': `Bearer ${token}`
                }
            }
          ).then(response=> {
            console.log("getAllInvoices() SUCCESS");
            console.log(response.data);
            this.setState({invoice_list: response.data});
          }).catch(error=> {
            console.log("ERROR Business Name List", error.message);
          });
    }

    render() {
        return (
            <div>
                <div><h1> Admin Invoice Management </h1></div>
                <div>
                    <label className='order__label'>Business List:</label>
                    <input className='order__input' list="location" onChange={this.handleBusinessChange} />
                        <datalist id="location">
                            {this.state.business_list ?
                                this.state.business_list.map((business)=> [
                                        <option key={business.accountId} value={business.businessName} />
                                ]):
                                <option value="None available" />
                            }
                        </datalist>
                </div>
                <div>
                { this.state.selectedBusiness? 
                    <div>
                        <h3>{this.state.selectedBusinessName}</h3>
                        <br/><b>Business ID:</b> {this.state.selectedBusinessId}<br/>
                        <b>Business Address:</b> {this.state.selectedBusinessAddress}
                    </div>
                :   <div></div>
                }
                </div>

                <div>
                        <label htmlFor="start">Select Start Date</label>
                        <input type="date" onChange={this.handleStartDateChange} />
                        <label htmlFor="start">  End Date</label>
                        <input type="date" onChange={this.handleEndDateChange} />
                        <button className='btn' onClick={this.requestInvoice}>Generate</button>
                </div>


                { this.state.invoice_list? 
                    <div className='robot__table'>
                    <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="right"><b>Invoice ID</b></TableCell>
                            <TableCell align="right"><b>Issued At</b></TableCell>
                            <TableCell align="right"><b>Due Date</b></TableCell>
                            <TableCell align="right"><b>Amount Due</b></TableCell>
                            <TableCell align="right"><b>Status</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.invoice_list.map((invoice) => [
                        <TableRow key={invoice.invoiceId}>
                            <TableCell align="right">{invoice.invoiceId}</TableCell>
                            <TableCell align="right">{invoice.issuedAt}</TableCell>
                            <TableCell align="right">{invoice.dueDate}</TableCell>
                            <TableCell align="right">{invoice.amountDue}</TableCell>
                            <TableCell align="right">{invoice.status}</TableCell>
                            
                        </TableRow>
                        ])}
                    </TableBody>
                    </Table>
                </div>
                :   <div></div>
                }

            </div>
        )
    }
}

export default AdminInvoice;
