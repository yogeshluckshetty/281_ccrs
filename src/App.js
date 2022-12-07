import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Landing from './components/Landing/Landing';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';

import BODashboard from './components/BusinessOwner/BODashboard/BODashboard';
import Home from './components/BusinessOwner/Home/Home';
import Sales from './components/BusinessOwner/Sales/Sales';
import Invoice from './components/BusinessOwner/Invoice/Invoice';
import Orders from './components/BusinessOwner/Orders/Orders';
import Navigation from './components/BusinessOwner/Navigation/Navigation';
import RobotUsage from './components/BusinessOwner/RobotUsage/RobotUsage'

import AdminDashboard from './components/Admin/AdminDashboard';
import AdminHome from './components/Admin/AdminHome';
import AdminStatistics from './components/Admin/AdminStatistics';
import AdminInvoice from './components/Admin/AdminInvoice';
import AdminNavigation from './components/Admin/AdminNavigation';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>

          <Route path="/signup">
            <Signup />
          </Route>

          <Route path="/dashboard">
            <BODashboard currentPage={<Home />} />
          </Route>

          <Route path="/sales">
            <BODashboard currentPage={<Sales />} />
          </Route>

          <Route path="/invoice">
            <BODashboard currentPage={<Invoice />} />
          </Route>

          <Route path="/orders">
            <BODashboard currentPage={<Orders />} />
          </Route>

          <Route path="/navigation">
            <BODashboard currentPage={<Navigation />} />
          </Route>

          <Route path="/robotusage">
            <BODashboard currentPage={<RobotUsage />} />
          </Route>

          <Route path="/adminhome">
            <AdminDashboard currentPage={<AdminHome />} />
          </Route>

          <Route path="/adminstatistics">
              <AdminDashboard currentPage={<AdminStatistics />} />
          </Route>
          
          <Route path="/admininvoice">
            <AdminDashboard currentPage={<AdminInvoice />} />
          </Route>
          
          <Route path="/adminnavigation">
              <AdminDashboard currentPage={<AdminNavigation />} />
          </Route>
          <Route exact path="/">
            <Landing />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
