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
    const [numProvForms, setNumProvForms] = useState(0);
    const providerForms = ['2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', 'poop']

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
            <div onClick = {() => props.setShowForm(false)} className = "new-appt-bttn">Cancel</div> 
            {error && <Alert variant="danger">{error}</Alert>}
            <form onSubmit={e =>  { props.handleFacForm(e) } } className = 'appt-form'>
                <label>
                Facility: 
                <input name="facility" type="text" value={name} onChange={e => setName(e.target.value)} />
                </label>
                <label>
                Address (street, state, zipcode):  
                <input name="facility" type="text" value={name} onChange={e => setName(e.target.value)} />
                </label>
                <label>
                Contact email: 
                <input name="email" type="text" value={email} onChange={e => setEmail(e.target.value)} />
                </label>
                <label>
                Contact phone number: 
                <input name="phone" type="text" value={phoneNum} onChange={e => setPhoneNum(e.target.value)} />
                </label>
                <label>
                Phone number description (i.e., reception, provider's office): 
                <input name="phone-description" type="text" value={phoneNumDesc} onChange={e => setPhoneNumDesc(e.target.value)} />
                </label>
                <label>
                Primary provider's full name: 
                <input name="provider" type="text" value={provider} onChange={e => setProvider(e.target.value)} />
                </label>
                <label>
                Provider's title (i.e., doctor, nurse)
                <input name="provider" type="text" value={provider} onChange={e => setProvider(e.target.value)} />
                </label>
                {providerForms.slice(0,numProvForms).map((place, i) => {
                    return(
                        <div>
                            <label>
                            {place} provider's full name: 
                            <input name="provider" type="text" value={provider} onChange={e => setProvider(e.target.value)} />
                            </label>
                            <label>
                            {place} provider's title (i.e., doctor, nurse)
                            <input name="provider" type="text" value={provider} onChange={e => setProvider(e.target.value)} />
                            </label>
                        </div>
                        )
                })}
                <div onClick = {() => {
                    (numProvForms <= 10) && setNumProvForms(numProvForms + 1)
                    }} className = "new-appt-bttn">Add another provider</div> 
            <input className = "submit-bttn" type="submit" value="Submit" />
            </form>
        </div>
      );
}

