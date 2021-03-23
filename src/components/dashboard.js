import React, { Component } from 'react';
import ApptPreview from './appt-preview';
import ApptCarousel from './appt-carousel';
import ToDo from './to-do'; 

function Dashboard() {
    const isApptHappening = false

    return(
        <div className = "dashboard"> 
            <header className = 'header'>Dashboard Overview</header>
            <div className = "main">
                <ApptPreview isApptHappening={isApptHappening} />  
                <ToDo />
                <ApptCarousel />
            </div>
        </div>
    ); 
}

export default Dashboard;

        
        