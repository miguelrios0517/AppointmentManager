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
import PtntForm from './ptnt_form.js';

function Patients() {
    const {path, url} = useRouteMatch();    
    const[showForm, setShowForm] = useState(false)
    const[ids, setIds] = useState([])
    const { db, useDB } = useAuth()

    const patients = useDB('patients')

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
                    {showForm? 
                        <div onClick = {() => setShowForm(false)} className = "new-appt-bttn">Cancel</div>:
                        <div onClick = {() => setShowForm(true)} className = "new-appt-bttn">Add a Patient</div> 
                    }
                    {showForm ? 
                    <PtntForm
                        setShowForm = {setShowForm}
                    />
                    :null}
                </div> 
            </div>    
        </div>
    );
}

               

export default Patients;  
        
        