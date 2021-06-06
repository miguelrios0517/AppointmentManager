import React, { Component } from 'react';
import {useState, useEffect} from 'react'
import Sidebar from './components/sidebar';
import Signup from "./components/Signup"
import { AuthProvider } from "./contexts/AuthContext"
import { Container } from 'react-bootstrap'


import './App.css';

function App() {
  
  return (
    <AuthProvider>
      <div className = "App">
        <Container className = "d-flex align-items-center justify-content-center" style = {{minHeight: "100vh"}}>
          <div className = "w-100" style = {{ maxWidth: "400px"}}>
            <Signup />
          </div>
        </Container>
        <Sidebar />
      </div>
    </AuthProvider>
    
  );
}
  

export default App;
