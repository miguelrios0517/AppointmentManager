import React from 'react';
import { useState } from 'react';
import {Form, Button, Card, Alert} from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { ShortPtntForm } from './ptnt_form.js'
import FreeSolo from './freeSolo';

function ApptForm(props) {
    const [patient, setPatient] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [notKnowDuration, setNotKnowDuration] = useState(false);
    const [notKnowTime, setNotKnowTime] = useState(false);
    const [duration, setDuration] = useState('');
    const [location, setLocation] = useState('');
    const [address, setAddress] = useState('');
    const [facility, setFacility] = useState('');
    const [facilities, setFacilities] = useState([]);
    const [providers, setProviders] = useState([]);
    const [provider, setProvider] = useState('');
    const [error, setError] = useState('');
    const[showForm, setShowForm] = useState(false)
    const [loading, setLoading] = useState(false)
    const { useDB, db } = useAuth()
    const patients = useDB('patients')

    async function handleSubmit(e) {
      
        e.preventDefault()

        if (date == '') { 
            return setError('You must submit a date')
        }

        if (patient == 'select') {
          return setError('You must select a patient')
        }

        if (date != '' && notKnowDuration == false && duration != '') {
            return setError('You must input a time if a duration is present')
        }
        
        try {
            setError('')
            setLoading(true)
            const _time = time? time: '00:00'
            const _date = date? new Date(date+ 'T' + _time): null
            
            //taking the patient field set by ptntForm (set as a string "patient name (pid)")
            //TODO: once the patient field is set, need to grab the facilities and providers
            // Move this inside of handle change, because string must be split each time the
            // patient is changed in order to get the field suggestions for facility and provider
            const pat_arr = patient.split(", ")
            const pid = pat_arr[0]
            const _patient = pat_arr[1]

            //grabbing current facilitis and providers arrays and appending the new inputs inside db.send
            const pat_obj = patients.filter(ptnt => ptnt.id == pid)[0]
            const _facilities = pat_obj['facilities']
            const _providers = pat_obj['providers']
            console.log(pat_obj)
            console.log(_facilities, _providers)
            /*
            for (let p in patients){
              console.log(patients[p].id)
            } */

            await Promise.all([
              db.send({'patient': _patient, 'pid': pid, 'date':_date, 'time':_time, 'duration':duration, 'facility':facility, 'address':address, 'provider':provider, 'error':error}, 'appointments'), 
              facility!='' && db.edit(pid,{'facilities':[..._facilities, facility]}, 'patients')
            ]);

            await 

            props.setShowForm(false)

        } catch {
            setError('Failed to submit appointment')
        }
  
    }
    

/*
    const handleSubmit= (e) => {
        setError('')
        e.preventDefault();
        const _time = time? time: '00:00'
        const _date = date? new Date(date+ 'T' + _time): null
        console.log(_time)
        console.log(_date)

        const pat_arr = patient.split(", ")
        const pid = pat_arr[0]
        const _patient = pat_arr[1]
        setPatient(pat_arr[1])
        db.send({'patient': _patient, 'pid': pid, 'date':_date, 'time':_time, 'duration':duration, 'location':location, 'address':address, 'provider':provider, 'error':error}, 'appointments')
    }
*/
  
  
    return (
      <div className = 'form-container'>
        <div className = 'form'>
          {error && <Alert variant="danger">{error}</Alert>}
          <form onSubmit={e => { handleSubmit(e) }} className = 'appt-form'>
              <label>
              Patient Full Name: 
              <select value={patient} onChange={e => {
                const val = e.target.value
                setPatient(val)
                if (val == 'new-patient') {
                  setShowForm(true)
                } else {
                  setShowForm(false)

                  //taking the patient field and splitting it into name and pid (set as a string "patient name (pid)")
                  const pat_arr = val.split(", ")
                  const pid = pat_arr[0]
                  const _patient = pat_arr[1]

                  //grabbing current facilitis and providers arrays and appending the new inputs inside db.send
                  const pat_obj = patients.filter(ptnt => ptnt.id == pid)[0]
                  setFacilities(pat_obj['facilities'] === undefined? []:pat_obj['facilities'])
                  setProviders(pat_obj['providers'])
                  console.log(pat_obj['facilities'] === undefined? []:pat_obj['facilities'])
                }
                console.log('PATIENT FIELD CHANGE', val)
              }}>
                  <option value='select'>Select a patient</option>
                  <option value='new-patient'>Add a new patient</option>
                  {patients.map((p, i) => {
                              return <option value={p.id+', '+p.firstName+' '+p.lastName}>{((p.firstName+p.lastName)? (p.firstName+' '+p.lastName):'name not entered') + ' (' + p.id + ')'} </option>})}
              </select>
              </label>
              <label>
              Date:
              <input name="date" type="date" value={date} onChange={e => setDate(e.target.value)}/>
              </label>
              <label>
              Don't know Time?
              <input name="haveDuration" type="checkbox" checked={notKnowTime} onChange={e => {
                setNotKnowTime(e.target.checked)
                setNotKnowDuration(e.target.checked)
                }} />
              </label>
              <label>
              Time:
              <input name="time" type="time" value={time} onChange={e => setTime(e.target.value)} disabled = {(notKnowTime)? "disabled" : ""}  />
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
              Facility
              <FreeSolo options ={facilities}/>
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
          {showForm ? <ShortPtntForm setShowForm={setShowForm} setPatient={setPatient}/> : null}
        </div>
    </div>
    )
  }

//<input name="facility" type="text" value={facility} onChange={e => setFacility(e.target.value)} />

  export default ApptForm;