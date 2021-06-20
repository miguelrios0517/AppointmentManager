import React from 'react';
import '../App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import {db, useDB} from './db'

import Dashboard from './dashboard';
import Appointments from './appointments';
import Schedule from './schedule';
import PatientDirectory from './patient-directory';
import Appointment from './appointment'
import Sidebar from './sidebar/Sidebar'


function HomePage() {

    const appointments = useDB()

    return (
    <div>
        <Sidebar />
        <Switch>
            <Route exact path='/'>
                <Appointments appointments={appointments} db={db}/> 
            </Route>
            <Route exact path='/appointments'>
                <Appointments appointments={appointments} db={db}/>
            </Route>
            <Route exact path = "/appointments/:id">
                <Appointment />
            </Route>
            <Route exact path='/schedule'> 
                <Schedule appointments={appointments}/>
            </Route>
            <Route exact path = "/patients">
                <PatientDirectory />
            </Route>
        </Switch>
    </div>
  );
}

export default HomePage;
