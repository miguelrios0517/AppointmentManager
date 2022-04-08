import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext'
import {Form, Button, Card, Alert} from 'react-bootstrap'

function Patient() {
    //const [patObj, setPatObj] = useState({'email':'', 'facilities':[],'firstName':'', 'lastName':'', 'midInit':'', 'phoneNum': ''})
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [middleInitial, setMiddleInitial] = useState('')
    const [email, setEmail] = useState('')
    const [facilities, setFacilities] = useState([])
    const [ error, setError ] = useState('')
    const [keys, setKeys] = useState([])

    const { db, useDB } = useAuth()
    
    const _facilities = useDB('facilities')  

    let { id } = useParams()
    
    const _patient = db.get(id, 'patients');
    
    
    
    const patient = useDB('patients', id)
    
    //console.log()
    //setFirstName(patient.firstName)



   
   
    //(typeof _firstName != 'undefined') && setFirstName(_firstName)    

    return(
        <div className = "appointment-item">
            <header className = 'header'>Patient View</header>
            {error && <Alert variant="danger">{error}</Alert>}
            <div className = "main main-appointments">
                ID #{id}
                <br/><br/>
                {patient.length === 0? <p>There is no patient in the database corresponding to the given ID</p>:
                        patient.map((p, i) => {
                            return <div key={i}>
                                <b>Full Name:</b> {(p.firstName+p.lastName)? (p.firstName+' '+p.lastName):'n/a'} <br/>
                                <b>Phone number:</b> {p.phoneNum? p.phoneNum: 'n/a'} <br/>
                                <b>Email:</b> {p.email? p.email: 'n/a'} <br/>
                                <b>Facilities:</b> {p.facilities? p.facilities.map((f,i) =>
                                {
                                    const fac = _facilities.filter(_f => {
                                        f === _f.id && console.log('FACILITY', f, _f.id, _f.name)
                                        return f === _f.id
                                    })[0]
                                    return <div>
                                        <ul>{fac['name']}</ul>
                                        <ul>{fac['providers'].map(_p => {
                                            
                                            const prov = p['providers'] && p['providers'].includes(_p)? (_p.split(';')[0] + ' (' + _p.split(';')[1] +')'): ''
                                            return<ul>{prov}</ul>
                                        })}</ul>
                                        </div>}): 'n/a'} 

                                </div> 
                        })}

            </div>
        </div>
    );
}

export default Patient; 