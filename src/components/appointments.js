import React, { useState, useEffect } from 'react';
import AppoinmentForm from './appointment-form.js';
import ApptForm from './appt_form';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useRouteMatch
  } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext'
import PtntForm from './ptnt_form.js'
import FreeSolo from './freeSolo';


function Appointments() {
    const {path, url} = useRouteMatch();    
    const[showForm, setShowForm] = useState(false)
    const[ids, setIds] = useState([])
    const { db, useDB } = useAuth()

    const appointments = useDB('appointments')

    /*function newFormSubmit(appointment) { 
        appointment.time = appointment.time? appointment.time: '00:00'
        appointment.date = appointment.date? new Date(appointment.date+ 'T' + appointment.time): null
        console.log(appointment)
        db.send(appointment, 'appointments')
        setShowForm(false)
    }*/

    function deleteAppointment(id) {
        db.delete(id, 'appointments')
    }
 
    return(
        <div className = "appointments"> 
            <header className = 'header'>Appointments</header>
            <div className = "main main-appointments">
                <div className = "appt-list"> 
                        {appointments.length === 0? <p>There are no appointments to show. Click the button on the right to add a new appointment.</p>:
                        appointments.map((appt, i) => {
                            return <ul key={i}><b>Id:</b> {appt.id? appt.id: 'n/a'}, <b>Patient:</b> {appt.patient? appt.patient: 'n/a'}, <b>Date:</b> {appt.date? appt.date.toDate().toString(): 'n/a'}, <b>Facility:</b> {appt.facility? appt.facility: 'n/a'}, 
                            <b> Duration:</b> {appt.duration? appt.duration: 'n/a'}, <b>Address:</b> {appt.address? appt.address: 'n/a'}, <b>Provider:</b> {appt.provider? appt.provider: 'n/a'} <div onClick = {() => deleteAppointment(appt.id, 'appointments')}>Delete</div> <Link to={`/appointments/${appt.id}`}>View</Link></ul>
                        })}
                </div>
                <div className = "main main-vertical">
                    {showForm? 
                        <div onClick = {() => setShowForm(false)} className = "new-appt-bttn">Cancel</div>:
                        <div onClick = {() => setShowForm(true)} className = "new-appt-bttn">Add an appointment</div> 
                    }
                    {showForm ? <ApptForm setShowForm={setShowForm}/> :null}
                </div> 
            </div>    
        </div>
    );
}

               

export default Appointments;  