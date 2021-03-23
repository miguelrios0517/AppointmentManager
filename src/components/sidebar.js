import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

import DashboardRoundedIcon from '@material-ui/icons/DashboardRounded';
import EventNoteRoundedIcon from '@material-ui/icons/EventNoteRounded';
import ScheduleRoundedIcon from '@material-ui/icons/ScheduleRounded';
import PermContactCalendarRoundedIcon from '@material-ui/icons/PermContactCalendarRounded';

import Dashboard from './dashboard';
import Appointments from './appointments';
import Schedule from './schedule';
import PatientDirectory from './patient-directory';
import Appointment from './appointment';

function Sidebar(props) {

  const [appointments, setAppointments] = useState([])
  const drawerWidth = 240;

  const classes = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(3),
    },
  }));

  const icons = [<DashboardRoundedIcon />, <EventNoteRoundedIcon />, <ScheduleRoundedIcon />, <PermContactCalendarRoundedIcon />]
  const pageUrls = ['/dashboard', '/appointments', '/schedule', '/patients']

  return (
    <Router> 
      <div>
        <div className={classes.root}>
          <CssBaseline />
          <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
              paper: classes.drawerPaper,
            }}
            anchor="left"
          >
            <div className={classes.toolbar} />
            <Divider />
            <List>
              {['Dashboard', 'View Appointments', 'Schedule', 'Patient Directory'].map((text, index) => (
                <ListItem button key={text}>
                  <ListItemIcon>{icons[index]}</ListItemIcon>
                  <Link to = {pageUrls[index]}><ListItemText primary={text} /></Link>
                </ListItem>
              ))}
            </List>

          </Drawer>
          <main className={classes.content}>
            <div className={classes.toolbar} />
          </main>
        </div>

        {/*main application*/}
        <div className = "screen">
          <Switch>
            <Route path = "/dashboard">
              <Dashboard appointments={appointments}/>
            </Route>
            <Route exact path = "/appointments">
              <Appointments appointments={appointments} setAppointments={setAppointments}/>
            </Route>
            <Route path = "/appointments/:id">
              <Appointment />
            </Route>
            <Route path = "/schedule">
              <Schedule />
            </Route>
            <Route path = "/patients">
              <PatientDirectory />
            </Route>
          </Switch>
        </div>
      
      </div>
    </Router>
  );
}

export default Sidebar;