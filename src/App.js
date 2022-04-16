import React, { Component } from 'react';
import {useState, useEffect} from 'react'
import Signup from "./components/Signup"
import { AuthProvider } from "./contexts/AuthContext"
import { BrowserRouter as Router, Switch, Route, Redirect, Link, useHistory } from 'react-router-dom'

import PrivateRoute from "./components/PrivateRoute.js"

import ForgotPassword from "./components/ForgotPassword.js"
import UpdateProfile from "./components/UpdateProfile"
import Login from "./components/Login"

import Dashboard from './components/dashboard';
import Appointments from './components/appointments';
import Appointment from './components/appointment';
import ApptForm from './components/appt_form';
import Schedule from './components/schedule';
import Patients from './components/patients';
import Patient from './components/patient';
import PtntForm from './components/ptnt_form';
import Profile from './components/profile'
import Lab from './components/lab';


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
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { Alert } from 'react-bootstrap'
import { useAuth } from './contexts/AuthContext'


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

function DefaultContainer () {
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [error, setError] = useState('')
  const { currentUser, logout } = useAuth()
  const history = useHistory()

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  async function handleLogout() {
    setError('')
    try {
        await logout()
        history.push('/login')
    } catch {
        setError('Failed to log out')
    }
  }

  /*const handleClose = (route) => {
    if (route == 'profile') {
      history.push('/profile')
    }
    setAnchorEl(null);
  };*/

  const handleClose = (route) => {
    setAnchorEl(null);
  };

  return(
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Appointment Manager
          </Typography>
          <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <Link to={'/profile'} style={{textDecoration: 'none'}}>
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                </Link>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
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
        {error && <Alert variant = "danger">{error}</Alert>} 
        <Switch>
          <PrivateRoute exact path="/" component={Dashboard} />
          <PrivateRoute exact path="/patients" component={Patients} />
          <PrivateRoute exact path="/patients/:id" component={Patient} />
          <PrivateRoute exact path ="/new-patient" component ={PtntForm} />
          <PrivateRoute exact path="/appointments" component={Appointments} />
          <PrivateRoute exact path ="/appointments/:id" component ={Appointment} />
          <PrivateRoute exact path ="/new-appointment" component ={ApptForm} />
          <PrivateRoute path="/schedule" component={Schedule} />
          <PrivateRoute exact path = "/profile" component={Profile} />
          <PrivateRoute exact path = "/update-profile" component={UpdateProfile} />
          <PrivateRoute exact path = "/lab" component={Lab} />
        </Switch>
      </Box>
    </Box>
  );
}

export default App;


/*
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
*/