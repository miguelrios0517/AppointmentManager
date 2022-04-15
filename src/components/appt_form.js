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
import {Link, useHistory } from "react-router-dom";

import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { ShortPtntForm } from './ptnt_form_old.js'
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

    ///////////////////////////////////////////////variables///////////////////////////////////////////////////
    
    //Appointment form fields 
    const initialValues = {patient: '', date: '', time: '', duration: '', address: '', facility: '', provider:'', providerTitle:''}
    const [formValues, setFormValues] = useState(initialValues);
    
    //New patient form fields
    const [showForm, setShowForm] = useState(false); // opens modal
    const [firstName, setFirstName] = useState(''); 
    const [middleName, setMiddleName] = useState(''); 
    const [lastName, setLastName] = useState(''); 

    //Form states
    const [error, setError] = useState(''); 
    const [errors, setErrors] = useState([]); 
    const [message, setMessage] = useState('');

    //Patient, facility and provider objs
    const [patientObj, setPatientObj] = useState();
    const [facilityObjs, setFacilityObjs] = useState([]);
    const [facilityObj, setFacilityObj] = useState({});
    const [providers, setProviders] = useState([]); 

    //Database
    const { useDB, db} = useAuth();
    const patients = useDB('patients');

    //Router
    const history = useHistory();


    /////////////////////////////////////////////handle input change/////////////////////////////////////////////////////

    //verify that the correct facility objects are set
    //useEffect(() => {console.log('Facility Objects', facilityObjs)}, [facilityObjs])

    /* params: event, event.target,value (in this case patient field value)
    1) shows new patient form if patient is created
    2) grabs patient object and sets as global variable [ptntObj = {dict/obj}]
    3) sets the facility options if available in patient object [facilityOpts, setFacilityOptions = [array of names]] 
    4) pushes dict obj to _facs which stores an array of facility names and ids [{'id':fid, 'name':fac_obj['name']}] */
    function handlePatientChange(e) {
        const val = e.target.value; 
        setFormValues({...formValues, patient:val})
        setFacilityObjs([]); //clear facilities from previous patient entry
        

        if (val == 'new-patient') { //create a new patient
            setShowForm(true);
        } else { // a patient is selected from dropdown
            setShowForm(false);
            //seperate patient name and patient id from select input ("[patient name],[id]")
            const pat_arr = val.split(", ");
            const pid = pat_arr[0];  
            //grab the patient from the database and store it in PatientObj hook
            store.collection('patients').doc(pid).get().then(snapshot => {
                const _pat = snapshot.data()
                _pat.id = snapshot.id 
                console.log('Making sure id is in _pat', _pat)
                setPatientObj(_pat);
                //ptntObj = snapshot.data();
            })
        }
    }

 /*
    checks for patientObj. Once hook is set...
    1) grabs the array of facility ids [fids] from the patient obj
    2) maps array to a function in which each fid (item) is used to query the database for its corresponding facility object
    3) appends the facility object to the current facilityObjs (i.e., [...facilityObjs, newObj]) and sets the resulting array 
    */
    useEffect(() => {
        if (typeof patientObj != 'undefined') {
            console.log('Patient Object', patientObj)
            if ((Object.keys(patientObj).length != 0) && (typeof patientObj['facilities'] != 'undefined')) {
                console.log('inside if')
                console.log('Facilities', patientObj.facilities)
                patientObj['facilities'].map((fid) => {
                    console.log('inside map')
                    store.collection('facilities').doc(fid).get().then(snapshot => {
                        console.log('FacObj from database (snapshot.data)', snapshot.data(), fid, snapshot.id)
                        const _fac = snapshot.data()
                        _fac.id = snapshot.id 
                        console.log('Making sure id is in _fac', _fac)
                        setFacilityObjs(facs => [...facs, _fac]);
                    })
                })
            }
        }
    }, [patientObj])

    /* params: event, event.target,value (in this case patient field value)
    1) matches name input w/ facility id in _facs array, makes a query to the database for the following info...
    providers if matched with patient's, and the address
    2) sets providers the input suggestions, and fills in the address field */
    function handleFacilityChange(val) {
        if(isFacility(val)) {
            //grab the facility object that matches the input name
            const facObj = facilityObjs.filter(fac => {
                return fac.name === val;
            })[0];
            console.log('THE FACILITY EXISTS', facObj)

            //set the facility name, address and provider autocomplete suggestions
            if (facObj != null) {
                setFacilityObj(facObj)
                setFormValues({...formValues, facility:val, address:facObj.address})
                setProviders(facObj.providers)
            } 
        } else {
            //if facility does not exist only set the facility name
            console.log('NEW FACILITY ENTRY')
            setFormValues({...formValues, facility:val})
            setFacilityObj({})
            setProviders([])

        }
    }

    function provTitleInputChange(data) {
        setFormValues({...formValues, providerTitle:data})
    }

    function provInputChange(data) {
        if (data.includes(" (")) {
            const prov_ = data.split(" (");
            setFormValues({...formValues, provider:prov_[0], providerTitle:prov_[1].slice(0,-1)})
        }
        else {
            setFormValues({...formValues, provider:data})
        }
    }

    /////////////////////////////////////////////helper functions/////////////////////////////////////////////////////
    function isFacility(val) {
        let exists = false;
        facilityObjs.forEach(function(item,index) {
            //console.log('isFacility', item.name, val, (item.name === val))
            if (item.name === val) exists = true;
        })
        return exists;
    }

    function isProvider() {
        console.log("CHECKING IF PROVIDER")
        if(Object.keys(facilityObj).length != 0) {
            for(var i=0;i<facilityObj.providers.length; i++) {
                if((facilityObj.providers[i].name === formValues.provider) && (facilityObj.providers[i].title === formValues.providerTitle)) {
                    console.log('--------------------')
                    console.log(formValues.provider, formValues.providerTitle)
                    return true
                }
            }
        }
        return false
    } 

    const checkKeyDown = (e) => {
        if (e.code === 'Enter') e.preventDefault();
    };

    /////////////////////////////////////////////handle form submit/////////////////////////////////////////////////////
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

        try {
            setError('')

            //format datetime
            const _time = formValues.time ? formValues.time : '00:00';
            const _date = formValues.date ? new Date(formValues.date + 'T' + _time) : null;

            //taking the patient field set by ptntForm (set as a string "pid,patient name")
            const pat_arr = formValues.patient.split(", ");
            const pid = pat_arr[0];
            const _patient = pat_arr[1];

            console.log('DATE & TIME', _date, _time)
            let appt_id;
            let fac_id = (Object.keys(facilityObj).length != 0)? facilityObj.id: ''

            var provObj = {'name': formValues.provider, 'title': formValues.providerTitle}
            db.send({'pid': pid, 'patient': _patient, 'date': formValues.date, 'time': _time, 'duration': formValues.duration, 'facility': formValues.facility, 'facilityId': fac_id, 'address': formValues.address, 'provider': provObj}, 'appointments').then(function (docRef) {
                db.edit(pid, {appointments: [...patientObj.appointments, docRef.id]},  'patients')
                appt_id = docRef.id;
            })
        
        
            //facility exists 
            if (Object.keys(facilityObj).length != 0) {
                console.log('############################')
                console.log('facility exists', facilityObj)
                Promise.all([
                    !(facilityObj.address === formValues.address) && db.edit(facilityObj.id, { 'address': formValues.address}, 'facilities'),
                    !(facilityObj.address === formValues.address) && console.log('ADDRESS NOT MATCH IN DB, EDITING FACILITIES OBJECT '),
                    !isProvider() && db.edit(facilityObj.id, { 'providers': [...facilityObj['providers'], provObj]}, 'facilities'),
                    !isProvider() && console.log('PROVIDER DOES NOT EXIST, EDITING FACILITIES OBJECT')
                ]);
            } 

            //facility does not exist
            if (Object.keys(facilityObj).length == 0 && formValues.facility != '') {
                console.log('facility does not exist', facilityObj)
                //create new facility document in db
                db.send({ 'name': formValues.facility, 'pid': pid, 'address': formValues.address, 'providers': [provObj]}, 'facilities').then(function (docRef) {
                    console.log("NEW FACILITY ENTRY")
                    db.edit(patientObj.id, { 'facilities': [...patientObj['facilities'], docRef.id]}, 'patients')
                    console.log("EDIT PATIENT OBJECT (adding new fid to facilities)")
                    db.edit(appt_id, {'facilityID':docRef.id}, 'appointments')
                })
            }

            setMessage('Appointment Submitted');
            setFormValues(initialValues)
            history.push("/appointments")


        } catch {
            setError('Failed to submit appointment')
        }
    }


 


    return (
        <div>
            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}
            <form onSubmit={e => { handleSubmit(e) }} onKeyDown={(e) => checkKeyDown(e)} className="w-full max-w-lg" id="appt-form" autocomplete="off">
                
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-3/4 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                            Patient
                        </label>
                        <select value={formValues.patient} onChange={e => { handlePatientChange(e) }} className="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example">
                        <option value='select'>Select a patient</option>
                            <option value='new-patient'>Add a new patient</option>
                            {patients.map((p, i) => {
                                return <option key={i} value={p.id + ', ' + p.firstName + ' ' + p.lastName}>{((p.firstName + p.lastName) ? (p.firstName + ' ' + p.lastName) : 'name not entered') + ' (' + p.id + ')'} </option>
                            })}
                        </select>
                    </div>
                </div>
                



                <div className="flex flex-wrap -mx-3 mb-6">

                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
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
                        {error && <p className ="text-red-500 text-xs italic">Please fill out this field.</p>}
                    </div>

                    <div className ="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className ="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                            Time
                        </label>
                        <div className ="relative w-full" data-mdb-toggle-button="false">
                            <input name="time" type="time" value={formValues.time} onChange={e => setFormValues({...formValues, time:e.target.value})} className ="form-input appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"/>
                        </div>
                    </div>

                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                            Duration
                        </label>
                        <input type="number" value={formValues.duration} onChange={e=>setFormValues({...formValues, duration:e.target.value})} className="form-input appearance-none block w-full px-3 py-1.5 mb-2 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"/>
                        <p className="text-gray-600 text-xs italic">In minutes</p>
                    </div>

                </div>

                <div className="flex flex-wrap -mx-3 mb-6">
                    
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                            Facility
                        </label>
                        <Autocomplete suggestions={facilityObjs.length !== 0 ? facilityObjs.map(fac => fac.name): []} setFormValue={handleFacilityChange} formValue={formValues.facility} className="form-input appearance-none block w-full px-3 py-1.5 mb-2 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"/>
                    </div>

                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                            Address
                        </label>
                        <input value={formValues.address} onChange={e => setFormValues({...formValues, address: e.target.value})} type="text" className="form-input appearance-none block w-full px-3 py-1.5 mb-2 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"/>
                    </div>
                </div>

                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                            Provider's Full Name
                        </label>
                        <Autocomplete suggestions={providers.length !== 0 ? providers.map((prov) => {
                        return(prov.name + " (" + prov.title + ")")
                        }) : []} setFormValue={provInputChange} formValue={formValues.provider} className="form-input appearance-none block w-full px-3 py-1.5 mb-2 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"/>
                    </div>
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                            Provider's Title
                        </label>
                        <Autocomplete suggestions={['Doctor', 'Nurse', 'Physical Therapist', 'Dentist']} setFormValue={provTitleInputChange} formValue={formValues.providerTitle} className="form-input appearance-none block w-full px-3 py-1.5 mb-2 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"/>
                        <p className="text-gray-600 text-xs italic">(i.e., doctor, nurse, physical therapist)</p>
                    </div>
                </div>

            </form>
            <div className="flex flex-wrap -mx-3 mb-6">
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
