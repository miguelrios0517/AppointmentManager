import React, { Component } from 'react';
import {useState, useEffect} from 'react'
import Sidebar from './components/sidebar';
import Login from './components/Login/Login'
import useToken from './useToken';

import './App.css';

function App() {
  //const { token, setToken } = useToken();

  //if(!token) {
  //  return <Login setToken = {setToken} />
  //}
  
  return (
    <div className = "App">
      <Sidebar />
    </div>
  );
}
  

export default App;
