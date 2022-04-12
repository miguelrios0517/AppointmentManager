import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useRouteMatch
  } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext'
import PtntForm from './ptnt_form_old.js';

function Patients() {
    const {path, url} = useRouteMatch();    
    const[showForm, setShowForm] = useState(false)
    const[ids, setIds] = useState([])
    const { db, useDB } = useAuth()

    const patients = useDB('patients')

    const pat = patients.filter(p => {
        return p.id === 'vvWEj7MpFyriKHdfHX1l'
    })

    function newFormSubmit(item) {
        db.send(item, 'patients')
        setShowForm(false)
    }

    function deleteItem(id) {
        db.delete(id, 'patients')
    }
 
    return(
        <div className = "appointments"> 
            <header className = 'header'>Patients</header>
            <div className = "main main-appointments">
                <div className = "appt-list"> 
                        {patients.length === 0? <p>There are no patients to show. Click the button on the right to add a new patient.</p>:
                        patients.map((p, i) => {
                            return <ul key={i}><b>Id:</b> {p.id? p.id: 'n/a'}, <b>Patient:</b> {(p.firstName+p.lastName)? (p.firstName+' '+p.lastName):'n/a'}, <b>Phone number:</b> {p.phoneNum? p.phoneNum: 'n/a'}, 
                             <b>Email:</b> {p.email? p.email: 'n/a'}, <b>Provider:</b> {p.provider? p.provider: 'n/a'} <div onClick = {() => deleteItem(p.id, 'patients')}>Delete</div> <Link to={`/patients/${p.id}`}>View</Link></ul>
                        })}
                </div>
                <div className = "main main-vertical">
                </div> 
                    <Link to = "/new-patient">
                        <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Add new patient</button>
                    </Link>
                </div>    
        </div>
        
    );
}

               

export default Patients;  
        
        