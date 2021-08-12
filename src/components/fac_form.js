import React from 'react';
import {Form, Button, Card, Alert} from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react';


export function FacilityForm(props) {
    const [name, setName] = useState('');
    const [provider, setProvider] = useState('');
    const [providers, setProviders] = useState([]);
    const [email, setEmail] = useState('');
    const [phoneNum, setPhoneNum] = useState('');
    const [phoneNumDesc, setPhoneNumDesc] = useState('');
    const [error, setError] = useState('');
    const { db } = useAuth()
  
    /*
  const handleSubmit = (e) => {
    setError('')
    e.preventDefault();
    db.send({'firstName': firstName, 'middleInitial':middleInitial, 'lastName': lastName, 'providers': [], 'facilities': []}, 'patients').then(function(docRef) {
        props.setPatient(docRef.id + ', ' + firstName + ' ' + lastName) })
    props.setShowForm(false)
    }*/
    
    return (
        <div>
            <button onClick={() => { 
                props.setShowForm(false) 
                props.setPatient("select")
            }} className = "new-appt-bttn">Cancel</button>
            {error && <Alert variant="danger">{error}</Alert>}
            <form onSubmit={e =>  { props.handleFacForm(e) } } className = 'appt-form'>
                <label>
                Facility: 
                <input name="facility" type="text" value={name} onChange={e => setName(e.target.value)} />
                </label>
                <label>
                Provider: 
                <input name="provider" type="text" value={provider} onChange={e => setProvider(e.target.value)} />
                </label>
                <label>
                Email: 
                <input name="email" type="text" value={email} onChange={e => setEmail(e.target.value)} />
                </label>
                <label>
                Phone Number: 
                <input name="phone" type="text" value={phoneNum} onChange={e => setPhoneNum(e.target.value)} />
                </label>
                <label>
                Phone Number Description (i.e., front office, provider): 
                <input name="phone-description" type="text" value={phoneNumDesc} onChange={e => setPhoneNumDesc(e.target.value)} />
                </label>
            <input className = "submit-bttn" type="submit" value="Submit" />
            </form>
        </div>
      );
}

