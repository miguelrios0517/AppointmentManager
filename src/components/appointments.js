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
                <table style={{width:500}}>
                        <tr>
                            <th>Time</th>
                            <th>Patient</th>
                            <th>Facility</th>
                            <th>Provider</th>
                        </tr>
                        {appointments.map((appt, i) => {

                            //date cleanup
                            const date = appt.date.toDate();
                            var hour;
                            var minute = date.getMinutes();
                            (date.getHours() > 12)? (hour = date.getHours() - 12): (hour = date.getHours())
                            
                            const ampm = (date.getHours() > 12?'PM':'AM') 
                            var _ampm = ampm
                            var endminute = minute + (appt.duration? parseInt(appt.duration):0);
                            var endhour = Math.floor(endminute/60);
                            endhour = endhour + hour;
                            if(endhour != hour){
                                (endhour > 12) && (endhour = endhour - 12)
                                (endhour >= 12) && ((ampm === 'PM')? (_ampm = 'AM'): (_ampm = 'PM'))
                                
                            }
                            
                            hour = hour.toString();
                            (endminute > 60) && (endminute = endminute%60)
                            
                            (hour.length == 1) && (hour != 0) && (hour = '0' + hour)
                            

                            //provider clean up
                            var prov = appt.provider? appt.provider.split(';'): false
                            
                            var prov_t =  (prov[1] === 'undefined' || prov[1] === '')? '' : (' (' + prov[1] + ')')

                            return <tr>
                                    <td>{(hour != 0)? (hour + ':' + minute + ampm + ' - ' + endhour + ':' + endminute + _ampm): 'not found'}</td>
                                    <td>{appt.patient? appt.patient: 'n/a'}</td>
                                    <td>{appt.facility? appt.facility: 'n/a'}</td>s
                                    {}
                                    <td>{prov? (prov[0] + ' ' + prov_t) : 'n/a'}</td>
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