import React, { Component } from 'react';
import {useState, useEffect} from 'react'
import Sidebar from './components/sidebar';
import Signup from "./components/Signup"
import { AuthProvider } from "./contexts/AuthContext"
import { Container } from 'react-bootstrap'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Dashboard from "./components/dashboard"
import Login from "./components/Login"
import PrivateRoute from "./components/PrivateRoute.js"
import ForgotPassword from "./components/ForgotPassword.js"
import UpdateProfile from "./components/UpdateProfile"


import './App.css';

function App() {
  
  return (
    // why is authprovider needed as an enclosing tag for the entire app and the switch inside the router?
      <div className = "App">
        <Container className = "d-flex align-items-center justify-content-center" style = {{minHeight: "100vh"}}>
          <div className = "w-100" style = {{ maxWidth: "400px"}}>
            <Router>
              <AuthProvider>
                <Switch>
                  <PrivateRoute exact path = "/" component={Dashboard} />
                  <PrivateRoute exact path = "/update-profile" component={UpdateProfile} />
                  <Route path="/signup" component={Signup}/>  
                  <Route path="/login" component={Login}/>  
                  <Route path="/forgot-password" component={ForgotPassword}/>  
                </Switch>
              </AuthProvider>
            </Router>
          </div>
        </Container>
      </div>
  );
}
  

export default App;