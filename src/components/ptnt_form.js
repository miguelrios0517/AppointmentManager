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
import {Link, useHistory} from "react-router-dom";

import { Form, Button, Card, Alert, NavItem } from 'react-bootstrap'
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

function PtntForm(props) {

    //Patient form fields 
    const initialValues = {firstName: '', middleInitial: '', lastName: '', phoneNumber: '', email: '', homeAddress: ''}
    const [formValues, setFormValues] = useState(initialValues);

    //Facilities
    const [facilities, setFacilities] = useState([]);
    const [numFacilities, setNumFacilities] = useState(0);
    const [index, setIndex] = useState(0);

    //Form states
    const [error, setError] = useState(''); 
    const [errors, setErrors] = useState([]); 
    const [message, setMessage] = useState('');

    //database
    const { db } = useAuth();

    //Router
    const history = useHistory();

    /////////////////////////////////////////////helper functions/////////////////////////////////////////////////////
    const checkKeyDown = (e) => {
        if (e.code === 'Enter') e.preventDefault();
    };

    function addFacility () {
        setNumFacilities(numFacilities + 1)
        setFacilities([...facilities, {id: numFacilities + 1, name: '', address: '', phoneNumber: '', email: '', provider: '', providerTitle: ''}])
    }

    function deleteFacility (id) {
        console.log('DELETING FACILITY ID', id, facilities)
        setFacilities(facilities.filter((fac,i) => fac.id !== id))
    }

    const updateFacilities = (index, e) => {
        console.log('index: ' + index);
        console.log('property name: '+ e.target.name, 'target value: '+ e.target.value);
        let key = e.target.name 
        var updatedFacilities = facilities.map(target => {
            if (target.id === index) {
                target[key] = e.target.value
            }
            return target
        })
        console.log('DATA UPDATED', updatedFacilities)
        setFacilities(updatedFacilities);
    }

    useEffect(()=> {console.log('USE STATE UPDATED', facilities)}, [facilities]) 

    /////////////////////////////////////////////handle submit/////////////////////////////////////////////////////
    async function handleSubmit (e) {
        e.preventDefault();
        console.log("HANDLE SUBMIT", formValues)

        if (formValues.firstName == '' ) {
            //setErrors(errors => [...errors, 'patient']); 
            return setError('You must enter a first name');
        }
        if (formValues.lastName == '') {
            //setErrors(errors => [...errors, 'date']);
            return setError('You must enter a last name');
        }

        for(var i = 0; i<facilities.length; i++){
            let fac = facilities[i]
            console.log('VALIDATING FACILITY INPUTS', fac)
            if (fac.name == '' ){
                return setError('You must enter a name for each facility');
            }
            if (fac.address == '' ){
                return setError('You must enter an address for each facility');
            }
        }

        try {
            setError('')
            db.send({'firstName': formValues.firstName, 'middleInitial':formValues.middleInitial, 'lastName':formValues.lastName, 'phoneNumber':formValues.phoneNumber, 'email':formValues.email, 'homeAddress':formValues.homeAddress, 'facilities': [], 'appointments': []}, 'patients').then(function (docRef) {
                let pid = docRef.id
                console.log('Submitted patient obj',docRef.id)
                if(facilities.length > 0) {
                    console.log('submitting facilities')
                    let facArr = [];
                    for(var i = 0; i<facilities.length; i++){
                        let fac = facilities[i]
                        let primary = (i === 0)? true: false;                        
                        console.log('submitting facility', fac, 'index', i, 'primary', primary)
                        db.send({'patient':pid, 'name': fac.name, 'address': fac.address, 'phoneNumber': fac.phoneNumber, 'email': fac.email, 'providers': (fac.provider != ''? [{'provider': fac.provider, 'providerTitle': fac.providerTitle}]:[]), 'primary': (i===0?true:false)}, 'facilities').then((docRef)=> {
                            console.log('SENT FACILITY TO DATABASE', docRef.id)
                            facArr.push({'facility': docRef.id, 'primary':primary})
                            console.log(facArr)
                            db.edit(pid, {'facilities': facArr}, 'patients')
                        })
                        setIndex(index + 1)
                    }
                } else {
                    console.log('no facilities submitted')
                }
            })
            
            setFormValues(initialValues)
            setFacilities([])
            setMessage('Patient Submitted');
            history.push("/patients")

        } catch {
            setError('Failed to submit appointment')
        }

        

        /*db.send({'name': facility, 'address':facilityAdd, 'providers': providers}, 'facilities').then(function(docRef) {
            db.send({'firstName': firstName, 'middleInitial':middleInitial, 'lastName': lastName, 'email':email, 'phoneNum':phoneNum, 'facilities':[docRef.id], 'providers':providers}, 'patients')
        })*/
    }



    return (
        <div>
            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}
            <form onSubmit={e => { handleSubmit(e) }} onKeyDown={(e) => checkKeyDown(e)} className="w-full max-w-lg" id="ptnt-form" autocomplete="off">
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                            First Name
                        </label>
                        <input value={formValues.firstName} onChange={e => setFormValues({...formValues, firstName: e.target.value})} type="text" className="form-input appearance-none block w-full px-3 py-1.5 mb-2 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"/>
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                            Middle Initial
                        </label>
                        <input value={formValues.middleInitial} maxlength="1" onChange={e => setFormValues({...formValues, middleInitial: e.target.value})} type="text" className="form-input appearance-none block w-full px-3 py-1.5 mb-2 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"/>
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                            Last Name
                        </label>
                        <input value={formValues.lastName} onChange={e => setFormValues({...formValues, lastName: e.target.value})} type="text" className="form-input appearance-none block w-full px-3 py-1.5 mb-2 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"/>
                    </div>
                </div>

                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                            Phone number
                        </label>
                        <input value={formValues.phoneNumber} onChange={e => setFormValues({...formValues, phoneNumber: e.target.value})} type="text" className="form-input appearance-none block w-full px-3 py-1.5 mb-2 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"/>
                    </div>
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                            Email
                        </label>
                        <input value={formValues.email} onChange={e => setFormValues({...formValues, email: e.target.value})} type="text" className="form-input appearance-none block w-full px-3 py-1.5 mb-2 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"/>
                    </div>
                </div>

                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                            Home address
                        </label>
                        <input value={formValues.homeAddress} onChange={e => setFormValues({...formValues, homeAddress: e.target.value})} type="text" className="form-input appearance-none block w-full px-3 py-1.5 mb-2 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"/>
                    </div>
                </div>

                {facilities.map((f,i) => {
                    let primary = (i===0)? true: false
                    return(
                        <div className="mb-6" key={f.id}>
                            <FacForm id = {f.id} deleteFacility={deleteFacility} updateFacilities={updateFacilities} primary={primary}/>
                        </div>
                    )
                })}
            </form>

            <div className="flex flex-wrap -mx-3 mb-6">
                <button onClick = {()=> addFacility()} class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg text-sm px-3 py-2.5 mr-2 mb-2 inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
                    <span>Facility</span>
                </button>
                <button type="submit" form="ptnt-form" value="Submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Submit</button>
                <Link to = "/patients">
                    <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Cancel</button>
                </Link>
            </div>
        </div>

    
);}


function FacForm(props){
    const initialValues = {name: '', address: '', phoneNumber: '', email: '', provider: '', providerTitle: ''}
    const [formValues, setFormValues] = useState(initialValues)
    
    return(
        <div class="border-r border-b border-l border-t border-gray-400 bg-white rounded-r rounded-l p-4 leading-normal">
            <div className="relative flex flex-wrap -mx-3 mb-6">
                <button onClick={()=> {
                    console.log('CLICKED DELETE - ID:', props.id)
                    props.deleteFacility(props.id)}} className="absolute -top-3 right-5 h-6 w-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
                <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                    <span>{props.primary?'PRIMARY':''}</span>
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                        Facility Name
                    </label>
                    <input name="name" value={formValues.name} onChange={e => {
                        console.log('FACILITY NAME CHANGE')
                        props.updateFacilities(props.id, e)
                        setFormValues({...formValues, name: e.target.value})
                }} type="text" className="form-input appearance-none block w-full px-3 py-1.5 mb-2 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"/>
                </div>
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                        Address
                    </label>
                    <input name="address" value={formValues.address} onChange={e => {
                        console.log('Address NAME CHANGE')
                        props.updateFacilities(props.id, e)
                        setFormValues({...formValues, address: e.target.value})
                }} type="text" className="form-input appearance-none block w-full px-3 py-1.5 mb-2 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"/>
                </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                        Phone Number
                    </label>
                    <input name="phoneNumber" value={formValues.phoneNumber} onChange={e => {
                        console.log('Phone NAME CHANGE')
                        props.updateFacilities(props.id, e)
                        setFormValues({...formValues, phoneNumber: e.target.value})
                }} type="text" className="form-input appearance-none block w-full px-3 py-1.5 mb-2 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"/>
                </div>
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                        Email
                    </label>
                    <input name="email" value={formValues.email} onChange={e => {
                        console.log('Email NAME CHANGE')
                        props.updateFacilities(props.id, e)
                        setFormValues({...formValues, email: e.target.value})
                }} type="text" className="form-input appearance-none block w-full px-3 py-1.5 mb-2 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"/>
                </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-2">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                        Primary Provider
                    </label>
                    <input name="provider" value={formValues.provider} onChange={e => {
                        console.log('Prov NAME CHANGE')
                        props.updateFacilities(props.id, e)
                        setFormValues({...formValues, provider: e.target.value})
                }} type="text" className="form-input appearance-none block w-full px-3 py-1.5 mb-2 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"/>
                </div>
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                        Provider Title
                    </label>
                    <input name="providerTitle" value={formValues.providerTitle} onChange={e => {
                        console.log('Prov Title NAME CHANGE')
                        props.updateFacilities(props.id, e)
                        setFormValues({...formValues, providerTitle: e.target.value})
                }} type="text" className="form-input appearance-none block w-full px-3 py-1.5 mb-2 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"/>
                </div>
            </div>
        </div>
    )
}

export default PtntForm;

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
