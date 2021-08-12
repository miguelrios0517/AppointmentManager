import React from 'react';
import { useState } from 'react';
import {Form, Button, Card, Alert} from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { ShortPtntForm } from './ptnt_form.js'
import FreeSolo from './freeSolo';

import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";


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

    //const patients = useDB('patients')
    //const _facilities = useDB('facilities')

    
    /* const myPromise = new Promise((resolve, reject) => {  
      patients = useDB('patients'); 
      
      if(patients) {    
          resolve('Promise is resolved successfully.');  
      } else {    
          reject('Promise is rejected');  
      }
    }); */

    const patients = useDB('patients')
    const _facilities = useDB('facilities')
    console.log('patients',patients)
    console.log('facilities', _facilities)

    //useDB('facilities')

    
    /*useDB('patients').then(function(docRef) {
      patients = docRef.id
      console.log(patients) });*/

    /*
    
    const promises = [
      useDB('patients'),
      ];

    const allPromise = Promise.all([
      useDB('patients')
      ]);
 
    allPromise.then(values => {
      console.log('VALUES', values); // [valueOfPromise1, valueOfPromise2, ...]
      patients = values[0]
    }).catch(error => {
      console.log(error)  // rejectReason of any first rejected promise
    });
    */

    const handleInputChange = (e, data) => {
      console.log(data);
      setFacility(data);
      return data;
    };


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
            
            //taking the patient field set by ptntForm (set as a string "pid,patient name")
            const pat_arr = patient.split(", ")
            const pid = pat_arr[0]
            const _patient = pat_arr[1]

            //grabbing current facilitis and providers arrays and appending the new inputs inside db.send
            console.log('FACILITY', facility) 
            console.log([...facilities, facility])

            console.log('!(facility in facilities)', facility in facilities)
      
            Promise.all([
                db.send({'patient': _patient, 'pid': pid, 'date':_date, 'time':_time, 'duration':duration, 'facility':facility, 'address':address, 'provider':provider, 'error':error}, 'appointments'), 
                (facility!='' && !(facilities.includes(facility))) && db.edit(pid,{'facilities':[...facilities, facility]}, 'patients'), 
                (facility!='' && !(facilities.includes(facility))) && db.send({'patients':[pid]}, 'facilities')
              ]);

            props.setShowForm(false)

        } catch {
            setError('Failed to submit appointment')
        }
    }
  


            /*
            //if facility = new option
            !facilities.includes(facility) ?? db.send({'patients':[pid], 'address': address}, 'facilities').then(function(docRef) {
              const fid = docRef.id
              Promise.all([
                db.edit(pid,[fid], 'patients'), 
                db.send({'patient': _patient, 'pid': pid, 'date':_date, 'time':_time, 'duration':duration, 'facility':facility, 'fid':fid , 'address':address, 'provider':provider, 'error':error}, 'appointments')
              ])})

            //if facility = existing option
            if (facilities.includes(facility)) {
              console.log(facility)
              const fac_obj = _facilities.filter(fac => fac.id == facility)[0]
              console.log(fac_obj)
              // if address = different than in db -> confirm with user if they want to replace main addres
              if (('address' in fac_obj && address != fac_obj['address']) || !('address' in fac_obj)) {
                Promise.all([
                  db.edit(facility,{'address': address}, 'facilities'), 
                  db.send({'patient': _patient, 'pid': pid, 'date':_date, 'time':_time, 'duration':duration, 'facility':facility, 'fid':facility , 'address':address, 'provider':provider, 'error':error}, 'appointments')
                ])
              } 
              else {
                db.send({'patient': _patient, 'pid': pid, 'date':_date, 'time':_time, 'duration':duration, 'facility':facility, 'fid':facility , 'address':address, 'provider':provider, 'error':error}, 'appointments')
              }
            }
            */
      
            
            /*
            place 1
            place 2
            place 3
            

            1) choose from existing facility
              1a) choose from existing address
              2b) set new address
            2) set new facility
              2a) set new address
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
                  pat_obj && (setFacilities(pat_obj['facilities'] != undefined && pat_obj['facilities']))
                  //setProviders(pat_obj['providers'])
                  console.log('FACILITIES', pat_obj, pat_obj && (pat_obj['facilities'] != undefined && pat_obj['facilities']))
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
              <input name="date" type="date" value={date} onChange={e => {setDate(e.target.value)
              console.log('poop')} }/>
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
              <Autocomplete
                id="free-solo-demo"
                freeSolo
                value={facility}
                onInputChange={(e, data) => {
                  setFacility(data)
                  console.log('data', data)
                  if (data != '') {
                    const fac_obj = _facilities.filter(fac => fac.name == data)[0]
                    console.log('address', fac_obj['address'])
                    setAddress(fac_obj['address'])
                  }
                }}
                options={facilities.length === 0 ? []:facilities.map((fid)=> {
                  const fac_obj = _facilities.filter(fac => {
                    return fac.id === fid
                  })[0]
                  console.log('fac_obj', fid, fac_obj, (typeof fac_obj === 'undefined'))
                  if(!(typeof fac_obj === 'undefined')) {
                    console.log('return', fac_obj['name'])
                    return fac_obj['name']
                  } 
                  return false
                })}
                renderInput={(params) => (
                  <TextField {...params} label="freeSolo" margin="normal" variant="outlined" />
                  )}/>
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
//<FreeSolo value={facility} onChang={e => console.log(e.target.value)} options={facilities}/>
//<input name="facility" type="text" value={facility} onChange={e => setFacility(e.target.value)} />

  export default ApptForm;