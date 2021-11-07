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
import Modal from 'react-awesome-modal';



function Appointments() {
    const {path, url} = useRouteMatch();    
    const[showForm, setShowForm] = useState(false)
    const[ids, setIds] = useState([])
    const { db, useDB } = useAuth()
    const[modalIsOpen, setIsOpen] = useState(false)

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
            </div>    

            <button onClick={() => {
                setIsOpen(true)
                console.log("OPEN MODAL")
            }}>Add an appointment</button>
            <Modal 
                //isOpen={modalIsOpen}
                visible = {modalIsOpen}
                width="600"
                height="400"
                effect="fadeInUp"
                onClickAway={() => setIsOpen(false)}
            >
                <div className="portfolio-modal">
                <div>
                    <h3>New Appointment</h3>
                    <button onClick={() => setIsOpen(false)}>Cancel</button>
                    <ApptForm setShowForm={setIsOpen}/>
                </div>
                </div>
            </Modal>

        </div>
    );
}

               

export default Appointments;  