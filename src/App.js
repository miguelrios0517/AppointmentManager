import React, { Component } from 'react';
import {useState, useEffect} from 'react'
import Signup from "./components/Signup"
import { AuthProvider } from "./contexts/AuthContext"
import { Container } from 'react-bootstrap'
import { BrowserRouter as Router, Switch, Route, Redirect, useLocation } from 'react-router-dom'

import PrivateRoute from "./components/PrivateRoute.js"

import ForgotPassword from "./components/ForgotPassword.js"
import UpdateProfile from "./components/UpdateProfile"
import Login from "./components/Login"
import HomePage from "./components/HomePage"

import Dashboard from './components/dashboard';
import Appointments from './components/appointments';
import Schedule from './components/schedule';
import PatientDirectory from './components/patient-directory';
import Appointment from './components/appointment'
import Sidebar from './components/sidebar/Sidebar'



import './App.css';


function App() {

  //console.log(currentUser? currentUser: null)

  
  return (
    // why is authprovider needed as an enclosing tag for the entire app and the switch inside the router?
      <div className = "App">
        <Container className = "d-flex align-items-center justify-content-center" style = {{minHeight: "100vh"}}>
          <div className = "w-100" style = {{ maxWidth: "400px"}}>
            <Router>
              <AuthProvider>
                <Switch>
                  <Route exact path="/signup" component={Signup}/>  
                  <Route exact path="/login" component={Login}/>  
                  <Route exact path="/forgot-password" component={ForgotPassword}/>  
                  <Route component={DefaultContainer} />
                </Switch>
              </AuthProvider>
            </Router>
          </div>
        </Container>
      </div>
  );
}

const LoginContainer = () => (
  <div className="container">
    <Route exact path="/" render={() => <Redirect to="/login" />} />
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup}/>  
    <Route path="/forgot-password" component={ForgotPassword}/> 
  </div>
)


 const DefaultContainer = () => (
    <div className="container">
      <Sidebar />
      <PrivateRoute exact path="/" component={Dashboard} />
      <PrivateRoute path="/patients" component={PatientDirectory} />
      <PrivateRoute exact path="/appointments" component={Appointments} />
      <PrivateRoute path="/schedule" component={Schedule} />
      <PrivateRoute exact path ="/appointments/:id" component ={Appointment} />
      <PrivateRoute exact path = "/update-profile" component={UpdateProfile} />
    </div>
 )



export default App;