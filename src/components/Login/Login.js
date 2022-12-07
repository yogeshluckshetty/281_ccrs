import React, { Component } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';
import './Login.css';

const { API_URL } = require('../../config/config').default;

class Login extends Component {
    //URLs
    loginSuffix = '/auth/login';
    getAccountSuffix = '/account/user';

    constructor(props) {
        super(props);
        this.state = {
            loginSuccess: false,
            email: "",
            password: "",
            errorMessage: "",
            isAdmin: false
        };
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

    handleLogin = (e) => {
        e.preventDefault();
        const { email, password } = this.state;

        var loginUrl = API_URL + this.loginSuffix;
        axios.post(loginUrl,
            {
                username: email,
                password: password
            }).then(response => {
                console.log(response);
                localStorage.setItem('localUserId', response.data["id"]);
                localStorage.setItem('apiAuthToken', response.data["token"]);
                this.setState({
                    //loginSuccess: true,
                    isAdmin: response.data.roles[0] === 'ROLE_ADMIN'
                });
                this.getBusinessAccount();
          })
        .catch(error => {
            this.setState({ errorMessage: "Invalid username or password!" });
        });
    }

    getBusinessAccount() {
        console.log("getBusinessAccount()");
        console.log(localStorage.getItem('localUserId'));
        
        var accountUrl = API_URL + this.getAccountSuffix +"?userId=" + localStorage.getItem('localUserId');

        axios.get(accountUrl,
            { headers: {
                'Authorization': `Bearer ${localStorage.getItem('apiAuthToken')}`
            }})
            .then(response => {
                console.log("getBusinessAccount Success account:", response.data.accountId);
                localStorage.setItem('localAccountId', response.data["accountId"]);
                this.setState({
                    loginSuccess: true
                });
          })
          .catch(error => {
              console.log("ERROR getBusinessAccount()");
          });

    }

    render() {
        console.log("render Login");
        const { loginSuccess } = this.state;
        let redirect = (<div></div>);
        if(loginSuccess){
            if(this.state.isAdmin){
                redirect = (
                    <Redirect to="/adminhome" />
                );
            }else{
                redirect = (
                    <Redirect to="/dashboard" />
                );
            }
        }

        return (
            <div className="login">
                {redirect}
                <div className="login__main">
                    <span className="login__title">Login</span>

                    <form className="login__form" onSubmit={this.handleLogin}>
                        <label htmlFor="email">Email</label>
                        <input required id="email" type="email" onChange={this.handleEmailChange} placeholder="Enter email" />

                        <label htmlFor="password">Password</label>
                        <input required id="password" type="password" onChange={this.handlePasswordChange} placeholder="Enter password" />
                        <div class="errorMsg">{this.state.errorMessage}</div>
                        <button type="submit" className="login__button"><span>Log in</span></button>
                    </form>
                </div>
            </div>
        )
    }
}

export default Login;
