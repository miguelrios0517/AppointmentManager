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
import app from "../firebase"

function Patients() {
    const {path, url} = useRouteMatch();    
    const[showForm, setShowForm] = useState(false)
    const[ids, setIds] = useState([])
    const { db, useDB } = useAuth()

    const patients = useDB('patients')
    const facilities = useDB('facilities')
    let store = app.firestore()

    const pat = patients.filter(p => {
        return p.id === 'vvWEj7MpFyriKHdfHX1l'
    })

    function newFormSubmit(item) {
        db.send(item, 'patients')
        setShowForm(false)
    }

    function deletePatient(p) {
        console.log('ALL FACILITIES', p.facilities, p)
        p.facilities.forEach((f) => {
            console.log('DELETING FACILITY', f.facility)
            db.delete(f.facility, 'facilities')
        })
        db.delete(p.id, 'patients')
    }
 
    return(
        <div className = "appointments"> 
            <header className = 'header'>Patients</header>
            <div className = "main main-appointments">
                <div className = "appt-list"> 
                        {patients.length === 0? <p>There are no patients to show. Click the button on the right to add a new patient.</p>: <></>}
                        {(patients.length !== 0) &&
                        <table className ="table-auto" style={{width:1200}}>
                                <tr>
                                    <th>Patient</th>
                                    <th>Phone Number</th>
                                    <th>Email</th>
                                    <th>Primary Facility</th>
                                    <th>Primary Provider</th>
                                    <th></th>
                                </tr>
                        {patients.map((p, i) =>  {
                            console.log('ADDING CURRENT PATIENT OBJ', p)
                            let primaryFacility = ''
                            let primaryProvider = ''

                            return(
                            <tr>
                                <td>{"firstName" in p?p.firstName:''}{"middleInitial" in p? ' ' + p.middleInitial + ' ':' '}{"lastName" in p?p.lastName:''}</td>
                                <td>{"phoneNumber" in p?p.phoneNumber:''}</td>
                                <td>{"email" in p?p.email:''}</td>
                                <td>{primaryFacility}</td>
                                <td>{primaryProvider}</td>
                                <td><span onClick = {() => deletePatient(p)}>Delete</span> <Link to={`/patients/${p.id}`}>View</Link></td>
                            </tr>
                        )})}
                        </table>}
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
        
        