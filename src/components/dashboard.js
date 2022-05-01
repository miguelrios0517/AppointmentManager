import React, { Component, useState } from 'react';
import ApptPreview from './appt-preview';
import ToDo from './to-do'; 
import Widget from "./widget/Widget";
import Featured from "./featured/Featured";
import Chart from "./chart/Chart";
import { LocalDiningOutlined, PinDropSharp } from '@material-ui/icons';
import { Card, Alert, Button } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import "./dashboard.scss";
import DatatablePreview from './datatable-preview/DatatablePreview'

export default function Dashboard(props) {
    const { db, useDB } = useAuth();
    const appointments = useDB('appointments');
    const patients = useDB('patients');

    let payRate = 40

    let today =  new Date();
    today.setHours(0,0,0,0)
    let _today = new Date(today);
    let first = today.getDate() - today.getDay() + 1;
    let monday = new Date(_today.setDate(first));
    let sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 7)
    console.log('MONDAY', monday, 'SUNDAY', sunday)

    /*const appointmentsWeekArray = appointments.filter((appt) => {
        let date = new Date(appt.date)
        console.log('CURRENT DATE', date)
        console.log(date > monday)
        console.log(date < sunday)
        return (date > monday && date < sunday)
    })*/

    const appointmentsPostToday = appointments.filter((appt) => {
        let date = new Date(appt.date)
        console.log('date > today', date > today, date, today)
        return (date > today)
    }) 

    console.log('Appointments post today - unsorted', appointmentsPostToday)

    appointmentsPostToday.sort((a,b) => {
        let dateA = new Date(a.date + ' ' + a.time)
        let dateB = new Date(b.date + ' ' + b.time)
        if (dateA > dateB) {
            return 1
        }
        if (dateA < dateB) {
            return -1
        }
        return 0
    })
   
    console.log('Appointments post today - sorted', appointmentsPostToday)

    console.log('Appointments post today - first 10', appointmentsPostToday.slice(0,10))
    
    let appointmentsWeek = 0; 
    appointments.forEach((appt) => {
        let date = new Date(appt.date)
        console.log('CURRENT DATE', date)
        console.log(date > monday)
        console.log(date < sunday)
        if (date > monday && date < sunday) {
            appointmentsWeek++
        }
        //return (date > monday && date < sunday)
    })

    console.log('APPOINTMENTS FOR THE WEEK', appointmentsWeek)

    return(
        <div className = "dashboard"> 
            <div className = "main">
                <div className="home home-container widgets">
                    <Widget type="currentPatients" amount={patients.length}/>
                    <Widget type="appointmentsWeek" amount={appointmentsWeek}/>
                    <Widget type="incomeWeek" amount={appointmentsWeek*payRate}/>
                    <Widget type="miles" amount='150'/>
                </div>
                <div className="py-8 flex flex-col" id = "appointment-preview-list">
                    <div className="flex">
                        <p className="w-2/5 mb-2 pl-1">Your Next Appointment</p>
                        <p className="w-3/5 mb-2 pl-2">Upcoming Appointments</p>
                    </div>
                    <div className="flex justify-between"> 
                        <ApptPreview appointments={appointmentsPostToday.slice(0,10)}/> 
                        <DatatablePreview appointments={appointmentsPostToday.slice(0,10)}/>
                    </div>
                </div>
                <div className="flex">
                    <Featured />
                    <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />
                </div>
            </div>
        </div>
    ); 
}

        
        