import React from 'react';
import { useState } from 'react';
import {Form, Button, Card, Alert} from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import PtntForm from './ptnt_form.js'

function ApptForm(props) {
    const [patient, setPatient] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [notKnowDuration, setNotKnowDuration] = useState(false);
    const [duration, setDuration] = useState('');
    const [location, setLocation] = useState('');
    const [address, setAddress] = useState('');
    const [provider, setProvider] = useState('');
    const [error, setError] = useState('');
    const[showForm, setShowForm] = useState(false)
    const { useDB, db } = useAuth()
    const patients = useDB('patients')
    
    const handleSubmit= (e) => {
        setError('')
        e.preventDefault();
        const _time = time? time: '00:00'
        const _date = date? new Date(date+ 'T' + time): null
        console.log(_time)
        console.log(_date)
        
        const pat_arr = patient.split(", ")
        const pid = pat_arr[0]
        const _patient = pat_arr[1]
        setPatient(pat_arr[1])
        db.send({'patient': _patient, 'pid': pid, 'date':_date, 'time':_time, 'duration':duration, 'location':location, 'address':address, 'provider':provider, 'error':error}, 'appointments')
        props.setShowForm(false)
    }
  
    return (
      <div className = 'form-container'>
        <div className = 'form'>
          {error && <Alert variant="danger">{error}</Alert>}
          <form onSubmit={e => { handleSubmit(e) }} className = 'appt-form'>
              <label>
              Patient Full Name: 
              <select value={patient} onChange={e => {
                setPatient(e.target.value)
                if (e.target.value == 'new-patient') {
                  setShowForm(true)
                } else {
                  setShowForm(false)
                }
              }}>
                  <option value='select'>Select a patient</option>
                  <option value='new-patient'>Add a new patient</option>
                  {patients.map((p, i) => {
                              return <option value={p.id+', '+p.firstName+' '+p.lastName}>{((p.firstName+p.lastName)? (p.firstName+' '+p.lastName):'name not entered') + ' (' + p.id + ')'} </option>})}
              </select>
              </label>
              <label>
              Date:
              <input name="date" type="date" value={date} onChange={e => setDate(e.target.value)} />
              </label>
              <label>
              Time:
              <input name="time" type="time" value={time} onChange={e => setTime(e.target.value)} />
              </label>
              <label>
              Don't know duration?
              <input name="haveDuration" type="checkbox" checked={notKnowDuration} onChange={e => setNotKnowDuration(e.target.checked)} />
              </label>
              <label>
              Duration (in minutes):
              <input name="duration" type="number" value={duration} onChange={e => setDuration(e.target.value)} disabled = {(notKnowDuration)? "disabled" : ""}/>
              </label>
              <label>
              Location:
              <input name="location" type="text" value={location} onChange={e => setLocation(e.target.value)} />
              </label>
              <label>
              Address
              <input name="address" type="text" value={address} onChange={e => setAddress(e.target.value)} />
              </label>
              <label>
              Provider
              <input name="provider" type="text" value={provider} onChange={e => setProvider(e.target.value)} />
              </label>
              <input className = "submit-bttn" type="submit" value="Submit" disabled = {(showForm)? "disabled" : ""}/>
          </form>
        </div>
        <div className = 'form'>
          {showForm ? <PtntForm setShowForm={setShowForm} setPatient={setPatient}/> : null}
        </div>
    </div>
    )
  }

  export default ApptForm;