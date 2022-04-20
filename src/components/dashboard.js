import React, { Component, useState } from 'react';
import ApptPreview from './appt-preview';
import ApptListPreview from './appt-list-preview';
import ApptCarousel from './appt-carousel';
import ToDo from './to-do'; 
import Widget from "./widget/Widget";
import Featured from "./featured/Featured";
import Chart from "./chart/Chart";
import { LocalDiningOutlined, PinDropSharp } from '@material-ui/icons';
import { Card, Alert, Button } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import "./dashboard.scss";

export default function Dashboard(props) {
    return(
        <div className = "dashboard"> 
            <div className = "main">
                <div className="home home-container widgets">
                    <Widget type="user" />
                    <Widget type="order" />
                    <Widget type="earning" />
                    <Widget type="balance" />
                </div>
                <div className="py-4 flex justify-between" id = "appointment-preview-list">
                    <ApptPreview appointments={props.appointments}/> 
                    <ApptListPreview appointments={props.appointments}/>
                </div>
                <div className="flex">
                    <Featured />
                    <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />
                </div>
            </div>
        </div>
    ); 
}

        
        