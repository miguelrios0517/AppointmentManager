import React from 'react';
import '../App.css';
import { BrowserRouter as Router, Switch, Route, useHistory, useRouteMatch } from 'react-router-dom';
import {db, useDB} from './db'

import Dashboard from './dashboard';
import Appointments from './appointments';
import Schedule from './schedule';
import PatientDirectory from './patient-directory';
import Appointment from './appointment'
import Sidebar from './sidebar/Sidebar'

import { useAuth } from '../contexts/AuthContext'

function HomePage() {

    const history = useHistory()
    const appointments = useDB()
    let { path, url } = useRouteMatch();

    const { logout } = useAuth()

    return (
    <div className ="home-page">
        <Sidebar />
        <Switch>
            <Route exact path={`${path}`}>
                <Dashboard appointments={appointments}/> 
            </Route>
            <Route exact path={`${path}/appointments`}>
                <Appointments appointments={appointments} db={db}/>
            </Route>
            <Route exact path ={`${path}/appointments/:id`}>
                <Appointment />
            </Route>
            <Route exact path={`${path}/schedule`}> 
                <Schedule appointments={appointments}/>
            </Route>
            <Route exact path ={`${path}/patients`}>
                <PatientDirectory />
            </Route>
        </Switch>
    </div>
  );
}

export default HomePage;
