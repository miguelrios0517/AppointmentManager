import React, { Component } from 'react';
import {useState, useEffect} from 'react'
import Sidebar from './components/sidebar';
import Signup from "./components/Signup"
import { AuthProvider } from "./contexts/AuthContext"
import { Container } from 'react-bootstrap'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Dashboard from "./components/dashboard"


import './App.css';

function App() {
  
  return (
    // why is authprovider needed as an enclosing tag for the entire app and the switch inside the router?
    <AuthProvider>
      <div className = "App">
        <Container className = "d-flex align-items-center justify-content-center" style = {{minHeight: "100vh"}}>
          <div className = "w-100" style = {{ maxWidth: "400px"}}>
            <Router>
              <AuthProvider>
                <Switch>
                  <Rout exact path = "/" component={Dashboard} />
                  <Route path="/signup" component={Signup}/>  
                </Switch>
              </AuthProvider>
            </Router>
            <Signup />
          </div>
        </Container>
        <Sidebar />
      </div>
    </AuthProvider>
    
  );
}
  

export default App;
