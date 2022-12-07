import React, { Component } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';
import './Signup.css'

const { API_URL } = require('../../config/config').default;

class Signup extends Component {
    singupAccountSuffix = '/account/';
    singupBusinessUserSuffix = '/account/user';

    constructor(props) {
        super(props);
        this.state = {
            signupSuccess: false,
            fname:"",
            lname:"",
            email: "",
            password: "",
            businessname:"",
            address:"",
            city: "",
            state: "",
            zip: "",
            account : "",
            errorMessage: ""
        };
    }
    handleFNameChange = (e) => {
        this.setState({
            fname: e.target.value,
        })
    }
    
    handleLNameChange = (e) => {
        this.setState({
            lname: e.target.value,
        })
    }

    handleEmailChange = (e) => {
        this.setState({
            email: e.target.value,
        })
    }

    handlePasswordChange = (e) => {
        this.setState({
            password: e.target.value,
        })
    }

    handleBusinessnameChange = (e) => {
        this.setState({
            businessname: e.target.value,
        })
    }

    handleAddressChange = (e) => {
        this.setState({
            address: e.target.value,
        })
    }

    handleCityChange = (e) => {
        this.setState({
            city: e.target.value,
        })
    }

    handleStateChange = (e) => {
        this.setState({
            state: e.target.value,
        })
    }
    handleZipChange = (e) => {
        this.setState({
            zip: e.target.value,
        })
    }

    handleAccountChange = (e) => {
        this.setState({
            account: e.target.value === null? 0 : e.target.value 
        })
    }

    handleSignup = (e) => {
        e.preventDefault();
        const { businessname, address, city, state, zip, account } = this.state;

        //if there is no accout, then create new account for business
        if (account==="") {
            var createBusinessUrl = API_URL + this.singupAccountSuffix;
            console.log("handleSignup() create business");
            axios.post(createBusinessUrl,
                {
                    address : address,
                    city: city,
                    state: state,
                    zip:zip,
                    businessName: businessname
                }).then(response => {
                    console.log("Create Business SUCCESS");
                    console.log(response.data);
                    localStorage.setItem('localAccountId', response.data["accountId"]);
                    console.log(localStorage.getItem('localAccountId'));
                    this.setState({
                        account: response.data["accountId"]
                    });
                    this.createNewUser();
            })
            .catch(error => {
                console.log("ERROR: cannot create business");
                return;
            });
        }
        else {
            console.log("handleSignup() create user only with existing account");

            this.createNewUser();
        }    
    }

    createNewUser() {
        const { fname, lname, email, password, account } = this.state;
        var createUserUrl = API_URL + this.singupBusinessUserSuffix;
        console.log("createNewUser()");
        axios.post(createUserUrl,
            {
                "accountId": account,
                "fname": fname,
                "lname": lname,
                "email": email,
                "password": password
            }).then(response => {
                console.log("Create user SUCCESS");
                console.log(response);
                localStorage.setItem('localUserId', response.data["userId"]);
                console.log(localStorage.getItem('localUserId'));
          })
        .catch(error => {
            console.log("ERROR: cannot create user");
            return;
        });

        this.setState({
            signupSuccess: true
        });
    }

    render() {
        const { signupSuccess } = this.state;
        let redirect = (<div></div>);
        if(signupSuccess)
            redirect = (<Redirect to="/" />);

        return (
            <div>
                {redirect}
                <form className="form__register" onSubmit={this.handleSignup}>
                    <div className='form__title'>Sign Up as Business user</div>

                    <div className="form__label"> Create New Business User: </div>
                    <div className="form-group">
                        <label>First Name</label>
                        <input type="text"  onChange={this.handleFNameChange}  className="form-control" placeholder="Enter First Name" />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input type="text"  onChange={this.handleLNameChange}  className="form-control" placeholder="Enter Last Name" />
                    </div>
                    <div className="form-group">
                        <label>Email address</label>
                        <input type="email"  onChange={this.handleEmailChange} className="form-control" placeholder="Enter email" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password"   onChange={this.handlePasswordChange} className="form-control"  placeholder="Enter password" />
                    </div>
                    <div className="form-group">
                        <label>Business Account: </label>
                        <input type="text"  onChange={this.handleAccountChange} className="form-control"   placeholder="If you have an account.." />
                    </div>

                    <div  className="form__label"> Create New Business: </div>
                    <div className="form-group">
                        <label>Business Name</label>
                        <input type="text"  onChange={this.handleBusinessnameChange}  className="form-control"  placeholder="Enter Business Name" />
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <input type="text"  onChange={this.handleAddressChange} className="form-control"   placeholder="Enter Address" />
                    </div>
                    <div className="form-group">
                        <label>City</label>
                        <input type="text"  onChange={this.handleCityChange} className="form-control"   placeholder="Enter City" />
                    </div>
                    <div className="form-group">
                        <label>State</label>
                        <input type="text"  onChange={this.handleStateChange}  className="form-control"  placeholder="Enter State" />
                    </div>
                    <div className="form-group">
                        <label>Zip</label>
                        <input type="text"  onChange={this.handleZipChange}  className="form-control"  placeholder="Enter Zip" />
                    </div>
                    <button className="button" type="submit"><span>Sign Up</span></button>
                </form>
            </div>
        )
    }
}

export default Signup;
