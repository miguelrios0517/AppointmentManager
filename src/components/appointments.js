import React, { useState, useEffect } from 'react';
import AppoinmentForm from './appointment-form.js';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useRouteMatch
  } from "react-router-dom";
  

function Appointments(props) {
    const {path, url} = useRouteMatch();
    const[showForm, setShowForm] = useState(false)
    const[appointmentView, setAppointmentView] = useState(false)

    function newFormSubmit(appointment) {
        appointment.id = appointment.patient.substring(0,2) + appointment.provider.substring(0,2) + appointment.date
        props.setAppointments([...props.appointments, appointment])
        console.log(props.appointments)
        setShowForm(false)
    }

    return(
        <div className = "appointments"> 
            <header className = 'header'>Appointments</header>
            <div className = "main main-appointments">
                <div className = "appt-list"> 
                    {props.appointments.length === 0? <p>There are no appointments to show. Click the button on the right to add a new appointment.</p>:
                    props.appointments.map((appt, i) => {
                        return <ul key={i}><b>Patient:</b> {appt.patient? appt.patient: 'n/a'}, <b>Date:</b> {appt.date? appt.date: 'n/a'}, 
                        <b>Time:</b> {appt.time? appt.time: 'n/a'}, <b>Location:</b> {appt.location? appt.location: 'n/a'}, 
                        <b>Address:</b> {appt.address? appt.address: 'n/a'}, <b>Provider:</b> {appt.provider? appt.provider: 'n/a'} <Link to={`/appointments/${appt.id}`}>view</Link></ul>
                    })}
                </div>
                <div className = "main main-vertical">
                    {showForm? 
                        <div onClick = {() => setShowForm(false)} className = "new-appt-bttn">Cancel</div>:
                        <div onClick = {() => setShowForm(true)} className = "new-appt-bttn">Add an appointment</div> 
                    }
                    {showForm ? 
                    <AppoinmentForm 
                        showForm = {showForm}
                        newFormSubmit = {newFormSubmit}
                    />
                    :null}
                </div>        
            </div>
        </div>
    );
    //{showForm? <AppoinmentForm setAppointments = {props.setAppointments} />: null}
}


export default Appointments;  