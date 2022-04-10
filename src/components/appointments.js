import React, { useState, useEffect } from 'react';
import AppoinmentForm from './appointment-form.js';
//import ApptForm from './appt_form';
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
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import ApptFormModal from './FormModal.js'
import Empty from './empty.js'


function Appointments() {
    const {path, url} = useRouteMatch();    
    const[showForm, setShowForm] = useState(false);
    const[ids, setIds] = useState([]);
    const { db, useDB } = useAuth();
    const[modalIsOpen, setIsOpen] = useState(false);
    const [providerTitle, setProviderTitle] = useState('');


    const appointments = useDB('appointments');
    
    
    


    /*function newFormSubmit(appointment) { 
        appointment.time = appointment.time? appointment.time: '00:00'
        appointment.date = appointment.date? new Date(appointment.date+ 'T' + appointment.time): null
        
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
            {(appointments.length ===  0)? <p>There are no appointments to show. Click the button below to add a new appointment.</p>:<></>}
                {(appointments.length !== 0) &&
                <table style={{width:1200}}>
                        <tr>
                            <th>Patient</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Facility</th>
                            <th>Address</th>
                            <th>Provider</th>
                            <th></th>
                        </tr>
                        {appointments.map((appt, i) => {

                            console.log('current appointment', appt)
                            console.log('date' in appt)
                            'date' in appt? console.log('date:' + appt.date): console.log('no date available')

                            //date cleanup
                            
                            if (appt.time != null) {
                                var period
                                var hour = parseInt(appt.time.substring(0,2))
                                var minutes = parseInt(appt.time.substring(3,5))
                                //console.log(hour>12)
                                if (hour > 12) {
                                    hour = hour - 12
                                    period = 'PM'
                                }
                                else {
                                    period = 'AM'
                                }
                                console.log('time exists', appt.time, hour + ":" + minutes + " " + period)            
                            } else {
                                console.log('time does not exist')
                            }
                                    
                            
                            

                            return <tr>
                                    <td>{"patient" in appt?appt.patient:'n/a'}({appt.pid?appt.pid:''})</td>
                                    <td>{("date" in appt)?appt.date.toDate().toString().substring(0,15):'n/a'}</td>
                                    <td>{"time" in appt?(hour + ":" + minutes + " " + period):'n/a'}</td>
                                    <td>{"facility" in appt?appt.facility:'n/a'}</td>
                                    <td>{"address" in appt?appt.address:'n/a'}</td>
                                    <td>{"provider" in appt?appt.provider:'n/a'}</td>
                                    <td><span onClick = {() => deleteAppointment(appt.id, 'appointments')}>Delete</span> <Link to={`/appointments/${appt.id}`}>View</Link></td>
                                </tr>
                        })}
                    </table>}
            </div>    
            
            <Link to = "/new-appointment">
                <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Add new appointment</button>
            </Link>
        </div>
    );
}

//<ApptForm setShowForm={setIsOpen}/>
               

export default Appointments;  