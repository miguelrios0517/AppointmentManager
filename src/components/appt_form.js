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
    const [modalIsOpen, setIsOpen] = useState(false);
    const [patient, setPatient] = useState(''); //  form field value
    const [firstName, setFirstName] = useState(''); //  form field value
    const [middleName, setMiddleName] = useState(''); //  form field value
    const [lastName, setLastName] = useState(''); //  form field value
    const [date, setDate] = useState(''); //  form field value
    const [time, setTime] = useState(''); //  form field value
    const [notKnowDuration, setNotKnowDuration] = useState(false); //  form field value
    const [notKnowTime, setNotKnowTime] = useState(false); //  form field value
    const [duration, setDuration] = useState(''); //  form field value
    const [address, setAddress] = useState(''); //  form field value
    const [facility, setFacility] = useState(''); //  form field value
    const [facilityOptions, setFacilityOptions] = useState([]); // form field value suggestions, names of facility in patient object
    const [provider, setProvider] = useState(''); // form field value
    const [providers, setProviders] = useState([]); // form field value suggestions, intersection of ptntProviders and facProviders (list of ids)
    const [providerTitle, setProviderTitle] = useState(''); // from field value
    const [error, setError] = useState(''); // error message
    const [showForm, setShowForm] = useState(false); // opens modal
    const [patientObj, setPatientObj] = useState();
    const [facilityObjs, setFacilityObjs] = useState([]);


    //const [ptntObj, setPtntObj] = useState({});
    let ptntObj;
    let facObj;
    //const [facObj, setFacObj] = useState({});
    //other variables: const fac_obj



    let patObj; //patient object 
    let facilityId = ''; // the facility ID of the option selected (not rendered)
    let ptntFacilities = []; // facility id's stored inside of patient (not rendered)
    let ptntProviders = []; // stored patient providers (name;title)
    let facProviders = [];  // stored facility providers (name;title) 
    let facAddress = ''; // stored facility address
    let _facs = []; //array of {'id':fid, 'name':fac_obj['name']}
    let subtitle;

    const { useDB, db, getDocument, testFunction } = useAuth();
    const patients = useDB('patients');
    const _facilities = useDB('facilities');




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

    useEffect(() => {
        console.log('SET PATIENT OBJ', patientObj)
        if (typeof patientObj != 'undefined') {
            if ((Object.keys(patientObj).length != 0) && (typeof patientObj['facilities'] != 'undefined')) {
                console.log('patientObj.facilities', patientObj['facilities'])
                console.log('SET FACILITY OPTIONS 2', setFacilityOptions)
    
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

                patientObj['facilities'].map((fid) => {
                    store.collection('facilities').doc(fid).get().then(snapshot => {
                        console.log('SNAPSHOT DATA FACILITY', snapshot.data())
                        setFacilityObjs(facs => [...facs, snapshot.data()]);
                    })
                })
            }
        }
    }, [patientObj])

    useEffect(()=>{
        console.log('FACILITY OBJS SO FAR', facilityObjs)
    }, [facilityObjs])

    /* params: event, event.target,value (in this case patient field value)
    1) shows new patient form if patient is created
    2) grabs patient object and sets as global variable [ptntObj = {dict/obj}]
    3) sets the facility options if available in patient object [facilityOpts, setFacilityOptions = [array of names]] 
    4) pushes dict obj to _facs which stores an array of facility names and ids [{'id':fid, 'name':fac_obj['name']}] */
    function handlePatientChange(e) {
        const val = e.target.value; 
        setPatient(val);
        setFacilityObjs([]);
        

        if (val == 'new-patient') { //create a new patient
            setShowForm(true);
        } else { // a patient is selected from dropdown
            console.log('SET FACILITY OPTIONS', setFacilityOptions)
            setShowForm(false);

            //taking the patient field and splitting it into name and pid
            const pat_arr = val.split(", ");
            const pid = pat_arr[0];
            //const _patient = pat_arr[1];
            //using pid to filter the patient object and assign it to global variable 
            console.log('!!!!patient ob!11111', ptntObj)
            
            //ptntObj = getDocument(pid, 'patients');
            //console.log('!!!!patient ob!2222', ptntObj)

            store.collection('patients').doc(pid).get().then(snapshot => {
                setPatientObj(snapshot.data());
                console.log('SNAPSHOT DATA', snapshot.data())
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

    /* params: event, event.target,value (in this case patient field value)
    1) matches name input w/ facility id in _facs array, makes a query to the database for the following info...
    providers if matched with patient's, and the address
    2) sets providers the input suggestions, and fills in the address field */
    function handleFacilityChange(val) { 

        setFacility(val)
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
                setAddress(facObj.address);

                setProviders(facObj.providers.filter((p, i) => {
                    if (p.length > 1) {
                        return patientObj.providers.includes(p);
                    }
                })); // set to fac_provs x ptnt_provs

                //facAddress = facObj['address']; 
                //facProviders = facObj['providers'];
            }
        }
       
    }
    
    //place inside of html
    function provInputChange(data) {
        if (data.includes(" (")) {
            const prov_ = data.split(" (");
            console.log('PROVIDER INPUT CHANGE')
            setProvider(prov_[0]);
            setProviderTitle(prov_[1].slice(0,-1));
        }
        else {
            setProvider(data)
        }
        //setProviderTitle(title.substring(0, title_len-1))
        //setProvider(data)
    }

    useEffect(()=>{console.log(provider)},[provider])

    useEffect(()=>{console.log(providerTitle)},[providerTitle])


    async function handleSubmit(e) {

        e.preventDefault();

        if (date == '') {
            return setError('You must submit a date');
        }
        if (patient == 'select') {
            return setError('You must select a patient');
        }
        if (time === '' && notKnowDuration == false && duration !== '') {
            return setError('You must input a time if a duration is present');
        }

        try {
            setError('')

            //format datetime
            const _time = (time && !notKnowTime) ? time : '00:00';
            console.log('_TIME', _time);
            const _date = date ? new Date(date + 'T' + _time) : null;

            //taking the patient field set by ptntForm (set as a string "pid,patient name")
            const pat_arr = patient.split(", ");
            const pid = pat_arr[0];
            const _patient = pat_arr[1];

            console.log('POO POO')

            let facObj;
            isFacility(facility) && (facObj = facilityObjs.filter(fac => fac.name === facility)[0])
            console.log('PEE PEE')

            console.log('FAC OBJ', facObj);

            //console.log('ADDRESS', address, facObj['address'], !(address === facObj['address']));
            console.log('NOT KNOW TIME', notKnowTime, notKnowDuration, (!notKnowTime ? _time : 'poop'), (!notKnowDuration ? duration : 'poop'));

            //facility is left empty
            if (facility === '') {
                console.log("SUBMITTING EMPTY FACILITY")
                console.log("SUBMITTING EMPTY FACILITY")
                console.log("SUBMITTING EMPTY FACILITY")
             

                //create new appointment in db
                setTimeout(() => {db.send({ 'patient': _patient, 'pid': patientObj.id, 'date': _date, 'time': _time, 'duration': (!notKnowDuration ? duration : ''), 'facility': facility, 'facilityId': '', 'address': address, 'provider': provider + ';' + providerTitle, 'error': error }, 'appointments')}, 3000);
                setIsOpen(false);
            }

            //facility does not exist...
            if (facility != '' && !isFacility(facility)) {
                console.log("SUBMITTING NEW FACILITY")
                console.log("SUBMITTING NEW FACILITY")
                console.log("SUBMITTING NEW FACILITY")
   

                console.log('facility does not exists!', patientObj.facilities, 'patient object id', patientObj.id);
                console.log('facObj id',facObj['id'], 'obj', facObj)
                db.send({ 'name': facility, 'address': address, 'providers': [provider + ';' + providerTitle] }, 'facilities').then(function (docRef) {
                    Promise.all([
                        //edit patient['facilities] array in db if provider does not exist
                        !(patientObj['providers'].includes(provider + ';' + providerTitle)) && db.edit(pid, { 'facilities': [...patientObj['facilities'], docRef.id], 'providers': [...patientObj['providers'], provider + ';' + providerTitle] }, 'patients'),
                        //create new appointment in db
                        db.send({ 'patient': _patient, 'pid': pid, 'date': _date, 'time': _time, 'duration': duration, 'facility': facility, 'facilityId': docRef.id, 'address': address, 'provider': provider + ';' + providerTitle, 'error': error }, 'appointments')
                    ]);
                    setIsOpen(false);
                });
            }

            //facility exists...
            if (facility != '' && isFacility(facility)) {
                console.log('ISFACILITY', isFacility('poo poo'))
                console.log('facility exists!', patientObj.facilities, 'patient object id', patientObj.id);
                console.log('facObj id',facObj['id'], 'obj', facObj)
                //create new appointment in db
                db.send({ 'patient': _patient, 'pid': pid, 'date': _date, 'time': _time, 'duration': (!notKnowDuration ? duration : ''), 'facility': facility, 'facilityId': facObj.id, 'address': address, 'provider': provider, 'error': error }, 'appointments').then(function (docRef) {
                    Promise.all([
                        !(providers.includes(provider + ';' + providerTitle)) && db.edit(pid, { 'providers': [...patientObj['providers'], provider + ';' + providerTitle] }, 'patients'),
                        !(providers.includes(provider + ';' + providerTitle)) && db.edit(facObj.id, { 'providers': [...facObj['providers'], provider + ';' + providerTitle] }, 'facilities'),
                        !(address === facObj['address']) && db.edit(facObj.id, { 'address': address }, 'facilities'),
                    ]);
                    setIsOpen(false);
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
            <form onSubmit={e => { handleSubmit(e) }} onKeyDown={(e) => checkKeyDown(e)} class="w-full max-w-lg">
                
                <div class="flex flex-wrap -mx-3 mb-6">
                    <div class="w-full md:w-3/4 px-3 mb-6 md:mb-0">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                            Patient
                        </label>
                        <select value={patient} onChange={e => { handlePatientChange(e) }} class="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example">
                        <option value='select'>Select a patient</option>
                            <option value='new-patient'>Add a new patient</option>
                            {patients.map((p, i) => {
                                return <option value={p.id + ', ' + p.firstName + ' ' + p.lastName}>{((p.firstName + p.lastName) ? (p.firstName + ' ' + p.lastName) : 'name not entered') + ' (' + p.id + ')'} </option>
                            })}
                        </select>
                    </div>
                </div>

                <div class="flex flex-wrap -mx-3 mb-6">
                    <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                            Date
                        </label>
                        <div class="datepicker relative form-floating mb-3 xl:w-96" data-mdb-toggle-button="false">
                            <input type="text"
                            class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                            placeholder="Select a date" data-mdb-toggle="datepicker" />
                        </div>
                    </div>

                </div>


                <div class="flex flex-wrap -mx-3 mb-6">
                    <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                            First Name
                        </label>
                        <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane"/>
                        <p class="text-red-500 text-xs italic">Please fill out this field.</p>
                    </div>
                    <div class="w-full md:w-1/2 px-3">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name">
                            Last Name
                        </label>
                        <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="Doe"/>
                    </div>
                </div>



                <div class="flex flex-wrap -mx-3 mb-6">
                    <div class="w-full px-3">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                        Password
                    </label>
                    <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" type="password" placeholder="******************"/>
                    <p class="text-gray-600 text-xs italic">Make it as long and as crazy as you'd like</p>
                    </div>
                </div>
                <div class="flex flex-wrap -mx-3 mb-2">
                    <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-city">
                        City
                    </label>
                    <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-city" type="text" placeholder="Albuquerque"/>
                    </div>
                    <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
                        State
                    </label>
                    <div class="relative">
                        <select class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                        <option>New Mexico</option>
                        <option>Missouri</option>
                        <option>Texas</option>
                        </select>
                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                    </div>
                    <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-zip">
                        Zip
                    </label>
                    <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-zip" type="text" placeholder="90210"/>
                    </div>
                </div>
            </form>
            <form onSubmit={e => { handleSubmit(e) }} onKeyDown={(e) => checkKeyDown(e)} className='appt-form'>
                <label>
                    Patient:
                    <select value={patient} onChange={e => { handlePatientChange(e) }} class="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example">
                    <option value='select'>Select a patient</option>
                        <option value='new-patient'>Add a new patient</option>
                        {patients.map((p, i) => {
                            return <option value={p.id + ', ' + p.firstName + ' ' + p.lastName}>{((p.firstName + p.lastName) ? (p.firstName + ' ' + p.lastName) : 'name not entered') + ' (' + p.id + ')'} </option>
                        })}
                    </select>
                </label>   
                <div class="sm:w-1/3">
                    <label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="inline-full-name">
                        Full Name
                    </label>
                </div>
                <div class="sm:w-2/3">
                    <input class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-full-name" type="text" value="Jane Doe"/>
                </div>


                <label>
                    Date:
                    <DatePicker selected={date} onChange={(value) => setDate(value)} />
                </label>

                <div className="form-row">
                    <label>
                        <div>Time:</div>
                        <input name="time" type="time" value={time} onChange={e => setTime(e.target.value)} disabled={notKnowTime ? true : false} />
                    </label>
                    <label className="time-checkbox">
                        <div>Don't know time?</div>
                        <input name="haveDuration" type="checkbox" checked={notKnowTime} onChange={e => {
                            setNotKnowTime(e.target.checked)
                            setNotKnowDuration(e.target.checked)
                        }} />
                    </label>
                </div>

                <label>
                    <p>Duration (in minutes):</p>
                    <TextField id="outlined-basic" label="Address" variant="outlined" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} disabled={(notKnowDuration) ? true : false} value={duration} onChange={e => setDuration(e.target.value)} />
                </label>

                <label>
                    <p>Facility</p>
                    <Autocomplete suggestions={facilityObjs.length !== 0 ? facilityObjs.map(fac => fac.name): []} setFormValue={handleFacilityChange} formValue={facility} />
                </label>

                <label>
                    <p>Address</p>
                    <TextField id="outlined-basic" label="Address" variant="outlined" value={address} onChange={e => setAddress(e.target.value)} />
                </label>

                <label>
                    Provider's Full Name
                    <Autocomplete suggestions={providers.length !== 0 ? providers.map((prov) => {
                        let split = prov.split(";")
                        return(split[0] + " (" + split[1] + ")")
                    }) : []} setFormValue={provInputChange} formValue={provider} />     
                </label>

                <label>
                    Provider's Title (i.e., doctor, nurse, physical therapist):
                    <Autocomplete suggestions={['Doctor', 'Nurse', 'Physical Therapist', 'Dentist']} setFormValue={setProviderTitle} formValue={providerTitle} />
                </label>
                <input className="submit-bttn" type="submit" value="Submit" disabled={(showForm) ? "disabled" : ""} />
            </form>
        </div>

    
);}

export default ApptForm;

/*

  <div className="new-ptnt-form">
                            <label>
                                <p>First Name</p>
                                <input name="address" type="text" style={{ width: '100px' }} value={firstName} onChange={e => setFirstName(e.target.value)} />
                            </label>
                            <label>
                                <p>Middle I.</p>
                                <input name="address" type="text" style={{ width: '30px' }} value={middleName} onChange={e => setMiddleName(e.target.value)} />
                            </label>
                            <label>
                                <p>Rios Name</p>
                                <input name="address" type="text" style={{ width: '100px' }} value={lastName} onChange={e => setLastName(e.target.value)} />
                            </label>
                        </div>


 <Autocomplete suggestions={providers.length !== 0 ? providers.map((prov) => {
                                if (prov.length > 1) {
                                    let split = prov.split(";")
                                    console.log('OPTION: ', split[0] + " (" + split[1] + ")")
                                    return(split[0] + " (" + split[1] + ")")
                                }
                            }) : []} setFormValue={provInputChange} formValue={provider} />                   


<Autocomplete suggestions={providers.length !== 0 ? providers.reduce(function (filtered, option) {
                                if (option.length > 1) {
                                    let split = option.split(";")
                                    filtered.push(split[0] + " (" + split[1] + ")")
                                    console.log('OPTION: ', split[0] + " (" + split[1] + ")")
                                }
                                return filtered;
                            }, []) : []} setFormValue={provInputChange} formValue={provider} />


                    <Autocomplete suggestions={["Oranges", "Apples", "Banana", "Kiwi", "Mango"]} setFormValue = {setFacilityInfo} formValue = {facility}/>

                    <label>
                    Facility
                    <Autocomplete
                        menuStyle = {{maxHeight: '550px'}}
                        disablePortal
                        id="free-solo-demo"
                        freeSolo
                        value={facility}
                        onInputChange={(e, data) => {setFacilityInfo(data)}}
                        options={facilityOptions}
                        renderInput={(params) => (
                        <TextField {...params} label="Facility" margin="normal" variant="outlined" />
                        )}/>
                    </label>

                    <label>
                    <p>Address</p>
                    <TextField id="outlined-basic" label="Address" variant="outlined" value={address} onChange={e => setAddress(e.target.value)}/>
                    </label>

                    <label>
                    Provider's Full Name                            
                    <Autocomplete
                        disablePortal
                        id="free-solo-demo"
                        freeSolo
                        value={provider}
                        onInputChange={(e, data) => { provInputChange(data) }}
                        options={(providers.filter(p=>p.length>1))} //1 is the lenght of the space in line 275
                        getOptionLabel = {option => { 
                        var split = option.split(";")
                        return (split[0] + " (" + split[1] + ")")
                        }}
                        renderOption = {option => { 
                            var split = option.split(";")
                            return <p>{(split[0] + " (" + split[1] + ")")}</p>
                            }}
                            
                            renderInput={(params) => (
                            <TextField {...params} label="Provider" margin="normal" variant="outlined" />
                            )}/>
                        </label>
    
                        <label>
                            Provider's Title (i.e., doctor, nurse, physical therapist):
                            <Autocomplete
                            disablePortal
                            id="free-solo-demo"
                            freeSolo
                            value={providerTitle}
                            onInputChange={(e, data) => {
                                setProviderTitle(data)
                            }}
                            options={['Doctor', 'Nurse', 'Physical Therapist', 'Dentist']}
                            renderInput={(params) => (
                                <TextField {...params} label="Provider's Title" margin="normal" variant="outlined" />
                                )}/>
                        </label>
    


  
*/