import React, { Component } from 'react';
import ApptPreview from './appt-preview';
import ApptCarousel from './appt-carousel';
import ToDo from './to-do'; 
import { PinDropSharp } from '@material-ui/icons';

function Dashboard(props) {

    return(
        <div className = "dashboard"> 
            <header className = 'header'>Dashboard Overview</header>
            <div className = "main">
                <ApptPreview appointments={props.appointments} />  
                <ToDo />
                <ApptCarousel />
            </div>
        </div>
    ); 
}

export default Dashboard;

        
        