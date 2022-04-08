/*
TODO:
- Make sure all fields are clear if user clicks "cancel" on modal, i.e., closes the modal
- make sure the flow is fully correct/functional, should be able to input fields regardless if previous input were entered 
        - i.e., do not deactivate fields in flow order
        - i.e., user should be able to enter field names (such as facility or patient) regardless if previous values were submitted
        (like patient) and if suggestions are provided
- clean up handleFacilityChange and setting the provider suggestions options (instead of setting as a seperate useState, use 
    the facility obj itself like fac.providers.map(...))
*/


import React, { useState, useEffect } from 'react';
//import Modal from 'react-awesome-modal';
//import Autocomplete from "@material-ui/lab/Autocomplete";
import Autocomplete from './Autocomplete.js'
import TextField from "@material-ui/core/TextField";
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import {Link} from "react-router-dom";

import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { ShortPtntForm } from './ptnt_form.js'
import FreeSolo from './freeSolo';
// import DatePicker from '@mui/lab/DatePicker';
// import AdapterDateFns from '@mui/lab/AdapterDateFns';
// import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from "react-datepicker";
import app from "../firebase"

import "react-datepicker/dist/react-datepicker.css";

let store = app.firestore()

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';


// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

function ApptForm() {
    // new patient form fields
    const [firstName, setFirstName] = useState(''); 
    const [middleName, setMiddleName] = useState(''); 
    const [lastName, setLastName] = useState(''); 

    //to get rid of 1) inside form 2) when submitting the appointment
    const [notKnowDuration, setNotKnowDuration] = useState(false); 
    const [notKnowTime, setNotKnowTime] = useState(false); 
    const [showForm, setShowForm] = useState(false); // opens modal
    
    // appointment form fields 
    const initialValues = {patient: '', date: '', time: '', duration: '', address: '', facility: '', provider:'', providerTitle:''}
    const [formValues, setFormValues] = useState(initialValues);
    const [errors, setErrors] = useState([]); 
    
    //Form state
    const [error, setError] = useState(''); 
    const [message, setMessage] = useState('');

    //patient and facility objs
    const [facilityObjs, setFacilityObjs] = useState([]);
    const [patientObj, setPatientObj] = useState();

    //for autocomplete
    const [providers, setProviders] = useState([]); // form field value suggestions, intersection of ptntProviders and facProviders (list of ids)
    const [facilityOptions, setFacilityOptions] = useState([]); // form field value suggestions, names of facility in patient object

    //database objects
    const { useDB, db} = useAuth();
    const patients = useDB('patients');
    const _facilities = useDB('facilities');

    //const [ptntObj, setPtntObj] = useState({});
    let ptntObj;
    let facObj;
    //const [facObj, setFacObj] = useState({});
    //other variables: const fac_obj

    useEffect(() => {
        if (typeof patientObj != 'undefined') {
            if ((Object.keys(patientObj).length != 0) && (typeof patientObj['facilities'] != 'undefined')) {
                patientObj['facilities'].map((fid) => {
                    store.collection('facilities').doc(fid).get().then(snapshot => {
                        setFacilityObjs(facs => [...facs, snapshot.data()]);
                    })
                })
            }
        }
    }, [patientObj])

    /* params: event, event.target,value (in this case patient field value)
    1) shows new patient form if patient is created
    2) grabs patient object and sets as global variable [ptntObj = {dict/obj}]
    3) sets the facility options if available in patient object [facilityOpts, setFacilityOptions = [array of names]] 
    4) pushes dict obj to _facs which stores an array of facility names and ids [{'id':fid, 'name':fac_obj['name']}] */
    function handlePatientChange(e) {
        const val = e.target.value; 
        setFormValues({...formValues, patient:val})
        //setPatient(val);
        setFacilityObjs([]);
        

        if (val == 'new-patient') { //create a new patient
            setShowForm(true);
        } else { // a patient is selected from dropdown
            setShowForm(false);

            //taking the patient field and splitting it into name and pid
            const pat_arr = val.split(", ");
            const pid = pat_arr[0];
            //const _patient = pat_arr[1];
            //using pid to filter the patient object and assign it to global variable 
            
            //ptntObj = getDocument(pid, 'patients');
            //console.log('!!!!patient ob!2222', ptntObj)

            store.collection('patients').doc(pid).get().then(snapshot => {
                setPatientObj(snapshot.data());
                ptntObj = snapshot.data();
            })
            
            //ptntObj = patients.filter(ptnt => ptnt.id == pid)[0];
          
        }
    }

    function isFacility(val) {
        let exists = false;
        facilityObjs.forEach(function(item,index) {
            //console.log('isFacility', item.name, val, (item.name === val))
            if (item.name === val) exists = true;
        })
        return exists;

    }

    function provTitleInputChange(data) {
        setFormValues({...formValues, providerTitle:data})
    }

    /* params: event, event.target,value (in this case patient field value)
    1) matches name input w/ facility id in _facs array, makes a query to the database for the following info...
    providers if matched with patient's, and the address
    2) sets providers the input suggestions, and fills in the address field */
    function handleFacilityChange(val) {
        setFormValues({...formValues, facility:val})
    }
    
    function handleFacilityChange2(val) { 
        setFormValues({...formValues, facility:val})
        //setFacility(val)
        console.log("Facility Value:", val)
        console.log('outside if', isFacility(val))
         
        if(isFacility(val)) {
            console.log('inside if')
             //grab the facility id from _facs array [{'id':fid, 'name':fac_obj['name']}]
            const facObj = facilityObjs.filter(fac => {
                return fac.name === val;
            })[0];
            //[choose a different value/method to represent a new facility not just a numeric "0" which could be unstable]
            //console.log('FAC ID', fac_id['id'])
            console.log('THE FACILITY OBJECT', facObj)
            if (facObj != null) { // id == 0 means new facility 
                setFormValues({...formValues, address:facObj.address})
                //setAddress(facObj.address);

                
                setProviders(facObj.providers.filter((p, i) => {
                    if (p.length > 1) {
                        return patientObj.providers.includes(p);
                    }
                }));// set to fac_provs x ptnt_provs


                //facAddress = facObj['address']; 
                //facProviders = facObj['providers'];
            }
        }
       
    }
    
    //place inside of html
    function provInputChange(data) {
        if (data.includes(" (")) {
            const prov_ = data.split(" (");
            setFormValues({...formValues, provider:prov_[0], providerTitle:prov_[1].slice(0,-1)})
            //setProvider(prov_[0]);
            //setProviderTitle(prov_[1].slice(0,-1));
        }
        else {
            setFormValues({...formValues, provider:data})
            //setProvider(data)
        }
        //setProviderTitle(title.substring(0, title_len-1))
        //setProvider(data)
    }

    function provTitleInputChange(data) {
        setFormValues({...formValues, providerTitle: data})
    }
    

    async function handleSubmit(e) {
        e.preventDefault();
        console.log("HANDLE SUBMIT", formValues)

        if (formValues.patient == 'select' ) {
            //setErrors(errors => [...errors, 'patient']);
            return setError('You must select a patient');
        }
        if (formValues.date == '') {
            //setErrors(errors => [...errors, 'date']);
            return setError('You must submit a date');
        }
        if (formValues.time === '' && notKnowDuration == false && formValues.duration !== '') {
            //setErrors(errors => [...errors, 'time']); 
            return setError('You must input a time if a duration is present');
        }

        try {
            setError('')

            //format datetime
            const _time = (formValues.time && !notKnowTime) ? formValues.time : '00:00';
            const _date = formValues.date ? new Date(formValues.date + 'T' + _time) : null;

            //taking the patient field set by ptntForm (set as a string "pid,patient name")
            const pat_arr = formValues.patient.split(", ");
            const pid = pat_arr[0];
            const _patient = pat_arr[1];


            let facObj;
            isFacility(formValues.facility) && (facObj = facilityObjs.filter(fac => fac.name === formValues.facility)[0])

            //facility is left empty
            if (formValues.facility === '') {             
                //create new appointment in db
                setTimeout(() => {db.send({ 'patient': _patient, 'pid': patientObj.id, 'date': _date, 'time': _time, 'duration': (!notKnowDuration ? formValues.duration : ''), 'facility': formValues.facility, 'facilityId': '', 'address': formValues.address, 'provider': formValues.provider + ';' + formValues.providerTitle, 'error': error }, 'appointments')}, 3000);
                setMessage('Appointment Submitted');
            }

            //facility does not exist...
            if (formValues.facility != '' && !isFacility(formValues.facility)) {
                db.send({ 'name': formValues.facility, 'address': formValues.address, 'providers': [formValues.provider + ';' + formValues.providerTitle] }, 'facilities').then(function (docRef) {
                    Promise.all([
                        //edit patient['facilities] array in db if provider does not exist
                        !(patientObj['providers'].includes(formValues.provider + ';' + formValues.providerTitle)) && db.edit(pid, { 'facilities': [...patientObj['facilities'], docRef.id], 'providers': [...patientObj['providers'], formValues.provider + ';' + formValues.providerTitle] }, 'patients'),
                        //create new appointment in db
                        db.send({ 'patient': _patient, 'pid': pid, 'date': _date, 'time': _time, 'duration': formValues.duration, 'facility': formValues.facility, 'facilityId': docRef.id, 'address': formValues.address, 'provider': formValues.provider + ';' + formValues.providerTitle, 'error': error }, 'appointments')
                    ]);
                    setMessage('Appointment Submitted');
                });
            }

            //facility exists...
            if (formValues.facility != '' && isFacility(formValues.facility)) {
                //create new appointment in db
                db.send({ 'patient': _patient, 'pid': pid, 'date': _date, 'time': _time, 'duration': (!notKnowDuration ? formValues.duration : ''), 'facility': formValues.facility, 'facilityId': facObj.id, 'address': formValues.address, 'provider': formValues.provider, 'error': error }, 'appointments').then(function (docRef) {
                    Promise.all([
                        !(providers.includes(formValues.provider + ';' + formValues.providerTitle)) && db.edit(pid, { 'providers': [...patientObj['providers'], formValues.provider + ';' + formValues.providerTitle] }, 'patients'),
                        !(providers.includes(formValues.provider + ';' + formValues.providerTitle)) && db.edit(facObj.id, { 'providers': [...facObj['providers'], formValues.provider + ';' + formValues.providerTitle] }, 'facilities'),
                        !(formValues.address === facObj['address']) && db.edit(facObj.id, { 'address': formValues.address }, 'facilities'),
                    ]);
                    setMessage('Appointment Submitted');
                });
            }

        } catch {
            setError('Failed to submit appointment')
        }
    }


    const checkKeyDown = (e) => {
        if (e.code === 'Enter') e.preventDefault();
    };



    return (
        <div>
            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}
            <form onSubmit={e => { handleSubmit(e) }} onKeyDown={(e) => checkKeyDown(e)} class="w-full max-w-lg" id="appt-form" autocomplete="off">
                
                <div class="flex flex-wrap -mx-3 mb-6">
                    <div class="w-full md:w-3/4 px-3 mb-6 md:mb-0">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                            Patient
                        </label>
                        <select value={formValues.patient} onChange={e => { handlePatientChange(e) }} class="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example">
                        <option value='select'>Select a patient</option>
                            <option value='new-patient'>Add a new patient</option>
                            {patients.map((p, i) => {
                                return <option value={p.id + ', ' + p.firstName + ' ' + p.lastName}>{((p.firstName + p.lastName) ? (p.firstName + ' ' + p.lastName) : 'name not entered') + ' (' + p.id + ')'} </option>
                            })}
                        </select>
                    </div>
                </div>
                



                <div class="flex flex-wrap -mx-3 mb-6">

                    <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                            Date
                        </label>
                        <div className="relative w-full mb-2">
                            <DatePicker
                                selected={formValues.date}
                                onChange={(val) => setFormValues({...formValues, date:val})}
                                selectsStart   
                                nextMonthButtonLabel=">"
                                previousMonthButtonLabel="<"
                                popperClassName="react-datepicker-left"
                            />
                        </div>
                        {error && <p class="text-red-500 text-xs italic">Please fill out this field.</p>}
                    </div>

                    <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                            Time
                        </label>
                        <div class="relative w-full" data-mdb-toggle-button="false">
                            <input name="time" type="time" value={formValues.time} onChange={e => setFormValues({...formValues, time:e.target.value})} disabled={notKnowTime ? true : false} className ="form-input appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"/>
                        </div>
                    </div>

                    <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                            Duration
                        </label>
                        <input type="number" value={formValues.duration} onChange={e=>setFormValues({...formValues, duration:e.target.value})} class="form-input appearance-none block w-full px-3 py-1.5 mb-2 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"/>
                        <p class="text-gray-600 text-xs italic">In minutes</p>
                    </div>

                </div>

                <div class="flex flex-wrap -mx-3 mb-6">
                    
                    <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                            Facility
                        </label>
                        <Autocomplete suggestions={facilityObjs.length !== 0 ? facilityObjs.map(fac => fac.name): []} setFormValue={handleFacilityChange} formValue={formValues.facility} className="form-input appearance-none block w-full px-3 py-1.5 mb-2 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"/>
                    </div>

                    <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                            Address
                        </label>
                        <input value={formValues.address} onChange={e => setFormValues({...formValues, address: e.target.value})} type="text" class="form-input appearance-none block w-full px-3 py-1.5 mb-2 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"/>
                    </div>
                </div>

                <div class="flex flex-wrap -mx-3 mb-6">
                    <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                            Provider's Full Name
                        </label>
                        <Autocomplete suggestions={providers.length !== 0 ? providers.map((prov) => {
                        let split = prov.split(";")
                        return(split[0] + " (" + split[1] + ")")
                        }) : []} setFormValue={provInputChange} formValue={formValues.provider} className="form-input appearance-none block w-full px-3 py-1.5 mb-2 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"/>
                    </div>
                    <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                            Provider's Title
                        </label>
                        <Autocomplete suggestions={['Doctor', 'Nurse', 'Physical Therapist', 'Dentist']} setFormValue={provTitleInputChange} formValue={formValues.providerTitle} className="form-input appearance-none block w-full px-3 py-1.5 mb-2 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"/>
                        <p class="text-gray-600 text-xs italic">(i.e., doctor, nurse, physical therapist)</p>
                    </div>
                </div>

            </form>
            <div class="flex flex-wrap -mx-3 mb-6">
                <button type="submit" form="appt-form" value="Submit"  disabled={(showForm) ? "disabled" : ""} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Submit</button>
                <Link to = "/appointments">
                    <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Cancel</button>
                </Link>
            </div>
        </div>

    
);}

export default ApptForm;

/* 
    const [patient, setPatient] = useState(''); 
    const [date, setDate] = useState(''); 
    const [time, setTime] = useState(''); 
    const [duration, setDuration] = useState(''); 
    const [address, setAddress] = useState(''); 
    const [facility, setFacility] = useState(''); 
    const [provider, setProvider] = useState('');
    const [providerTitle, setProviderTitle] = useState(''); 
    let patObj; //patient object 
    let facilityId = ''; // the facility ID of the option selected (not rendered)
    let ptntFacilities = []; // facility id's stored inside of patient (not rendered)
    let ptntProviders = []; // stored patient providers (name;title)
    let facProviders = [];  // stored facility providers (name;title) 
    let facAddress = ''; // stored facility address
    let _facs = []; //array of {'id':fid, 'name':fac_obj['name']}
    let subtitle;
*/


/*useEffect(() => {
    if (patient == 'new-patient') { //create a new patient
        setShowForm(true);
    } else { // a patient is selected from dropdown
        setShowForm(false);

        //taking the patient field and splitting it into name and pid
        const pat_arr = patient.split(", ");
        const pid = pat_arr[0];
        //const _patient = pat_arr[1];
        //using pid to filter the patient object and assign it to global variable 
        ptntObj = db.get(pid, 'patients');
        handlePatientChange(ptntObj);
}

}, [patient])*/

 /*const facility_opts = patientObj['facilities'].map((fid) => {
                    const fac = getDocument(fid, 'facilities');
                      const fac = _facilities.filter(fac => {
                        return fac.id === fid;
                    })[0];
                    if (typeof fac != 'undefined') {
                        _facs.push({ 'id': fid, 'name': fac['name'] });
                        return fac['name'];
                    }
                    return false; })
    
                console.log('facility OPTIONS', facility_opts)
                setFacilityOptions(facility_opts) 
                
                (typeof patientObj['facilities'] != 'undefined') && (ptntFacilities = patientObj['facilities']);
                (typeof patientObj['providers'] != 'undefined') && (ptntProviders = patientObj['providers']);*/
