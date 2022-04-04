import React, { Component } from 'react';
import {useState, useEffect} from 'react'
import Signup from "./components/Signup"
import { AuthProvider } from "./contexts/AuthContext"
import { BrowserRouter as Router, Switch, Route, Redirect, Link } from 'react-router-dom'

import PrivateRoute from "./components/PrivateRoute.js"

import ForgotPassword from "./components/ForgotPassword.js"
import UpdateProfile from "./components/UpdateProfile"
import Login from "./components/Login"

import Dashboard from './components/dashboard';
import Appointments from './components/appointments';
import Appointment from './components/appointment'
import Schedule from './components/schedule';
import Patients from './components/patients';
import Patient from './components/patient';
import Sidebar from './components/sidebar/Sidebar'
import Toolbar from '@mui/material/Toolbar';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
//import InboxIcon from '@mui/icons-material/MoveToInbox';
//import MailIcon from '@mui/icons-material/Mail';
import DashboardRoundedIcon from '@material-ui/icons/DashboardRounded';
import EventNoteRoundedIcon from '@material-ui/icons/EventNoteRounded';

import { SidebarData }  from './components/sidebar/SidebarData'

const drawerWidth = 240;

//(filtered data for currentUser (not able to see entire collection), combined db with authcontext (i.e., db.send, db.delete, and usedb() is now in authcontext))
// To do 6/30
// - add form verification to appt_form
// - finish ptntForm and switch with patientForm
// 


// Next steps
// - Learn how to test components in react (e.g., using jest)
// - Use firebase to host your site on the web
// - Read about proper react documentation and commenting, modify readOnly



//import './App.css';


function App() {

  //console.log(currentUser? currentUser: null)

  
  return (
    // why is authprovider needed as an enclosing tag for the entire app and the switch inside the router?
      <div className = "App">
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
  );
}

 const DefaultContainer = () => (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Appointment Manager
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {SidebarData.map((item, index) => (
              <Link to = {item.path} style={{textDecoration: 'none'}}>
                <ListItem button key={item.title}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItem>
              </Link>
            ))}
          </List> 

          <Divider />
          <List>
            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                <ListItem button key={text}>
                  <ListItemIcon>
                    {index % 2 === 0 ? <DashboardRoundedIcon /> : <EventNoteRoundedIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['All mail', 'Trash', 'Spam'].map((text, index) => (
                <ListItem button key={text}>
                  <ListItemIcon>
                    {index % 2 === 0 ? <DashboardRoundedIcon /> : <EventNoteRoundedIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Switch>
          <PrivateRoute exact path="/" component={Dashboard} />
          <PrivateRoute exact path="/patients" component={Patients} />
          <PrivateRoute exact path="/patients/:id" component={Patient} />
          <PrivateRoute exact path="/appointments" component={Appointments} />
          <PrivateRoute exact path ="/appointments/:id" component ={Appointment} />
          <PrivateRoute path="/schedule" component={Schedule} />
          <PrivateRoute exact path = "/update-profile" component={UpdateProfile} />
        </Switch>
      </Box>
    </Box>
)

const LoginContainer = () => (
  <div className="container">
    <Route exact path="/" render={() => <Redirect to="/login" />} />
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup}/>  
    <Route path="/forgot-password" component={ForgotPassword}/> 
  </div>
)

const DefaultContainer2 = () => (
  <div>
    <Sidebar />
    <div className = "">
      <Toolbar />
      <PrivateRoute exact path="/" component={Dashboard} />
      <PrivateRoute exact path="/patients" component={Patients} />
      <PrivateRoute exact path="/patients/:id" component={Patient} />
      <PrivateRoute exact path="/appointments" component={Appointments} />
      <PrivateRoute exact path ="/appointments/:id" component ={Appointment} />
      <PrivateRoute path="/schedule" component={Schedule} />
      <PrivateRoute exact path = "/update-profile" component={UpdateProfile} />
    </div>
  </div>
)

export default App;