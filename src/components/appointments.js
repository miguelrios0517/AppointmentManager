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
    const[showForm, setShowForm] = useState(false);
    const[ids, setIds] = useState([]);
    const { db, useDB } = useAuth();
    const[modalIsOpen, setIsOpen] = useState(false);

    const appointments = useDB('appointments');

    /*function newFormSubmit(appointment) { 
        appointment.time = appointment.time? appointment.time: '00:00'
        appointment.date = appointment.date? new Date(appointment.date+ 'T' + appointment.time): null
        console.log(appointment)
        db.send(appointment, 'appointments')
        setShowForm(false)
    }*/

    function deleteAppointment(id) {
        db.delete(id, 'appointments');
    }
 
    return(
        <div className = "appointments"> 
            <header className = 'header'>Appointments</header>
            <div className = "main main-appointments">
                    <table style={{width:500}}>
                        <tr>
                            <th>Time</th>
                            <th>Patient</th>
                            <th>Facility</th>
                            <th>Provider</th>
                        </tr>
                        {appointments.length === 0? <tr>There are no appointments to show. Click the button below to add a new appointment.</tr>:
                        appointments.map((appt, i) => {
                            const date = appt.date.toDate();
                            var hour;
                            var minute = date.getMinutes();
                            //minute = minute.toString()
                            (date.getHours() > 12)? (hour = date.getHours() - 12): (hour = date.getHours())
                            console.log('APPT DURATION',appt.duration);
                            const ampm = (date.getHours() > 12?'PM':'AM') 
                            var _ampm = ampm
                            var endminute = minute + (appt.duration? parseInt(appt.duration):0);
                            var endhour = Math.floor(endminute/60);
                            endhour = endhour + hour;
                            if(endhour != hour){
                                (endhour > 12) && (endhour = endhour - 12)
                                (endhour >= 12) && ((ampm === 'PM')? (_ampm = 'AM'): (_ampm = 'PM'))
                                console.log('AMPM', ampm, ampm === 'PM', _ampm)
                            }
                            console.log('HOURS OVER', endhour, endminute/60)
                            hour = hour.toString();
                            (endminute > 60) && (endminute = endminute%60)
                            console.log('END TIME', hour, endminute);
                            
    


                            (hour.length == 1) && (hour != 0) && (hour = '0' + hour)
                            console.log('DATE', date, hour, minute)
                            return <tr>
                                    <td>{(hour != 0)? (hour + ':' + minute + ampm + ' - ' + endhour + ':' + endminute + _ampm): 'not found'}</td>
                                    <td>{appt.patient? appt.patient: 'n/a'}</td>
                                    <td>{appt.facility? appt.facility: 'n/a'}</td>
                                    <td>{appt.provider? appt.provider: 'n/a'}</td>
                                </tr>
                        })}
                    </table>
                <div className = "appt-list"> 
                        {appointments.length === 0? <p></p>:
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