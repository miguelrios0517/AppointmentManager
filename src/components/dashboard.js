import React, { Component, useState } from 'react';
import ApptPreview from './appt-preview';
import ApptCarousel from './appt-carousel';
import ToDo from './to-do'; 
import { LocalDiningOutlined, PinDropSharp } from '@material-ui/icons';
import { Card, Alert, Button } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'

export default function Dashboard(props) {
    return(
        <div className = "dashboard"> 
            <header className="text-3xl font-bold underline">
                Dashboard Overview
            </header>
            <div className = "main">
                <ApptPreview appointments={props.appointments} />  
                <ToDo />
                <ApptCarousel />
            </div>
        </div>
    ); 
}

        
        