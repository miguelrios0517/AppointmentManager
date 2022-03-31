import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Switch, Route, Link, Outlet} from "react-router-dom";

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



import { SidebarData }  from './SidebarData'

export default function Sidebar(props) {

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

  return (
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
            {SidebarData.map((item, index) => (
              <ListItem button key={index}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <Link to = {item.path}><ListItemText primary={item.title} /></Link>
              </ListItem>
            ))}
          </List>

        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
        </main>
      </div>
  );
}