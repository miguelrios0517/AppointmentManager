/*
TODO:
- Change useeffect to onHandle functions
    -> one handles the patient change, the other handles the facility change
    -> handlePatientChange(e) 
        setPatient
        store patient object (ptntObj)
        setFacilityOpts

    -> handleFacilityChange(e)
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


import "react-datepicker/dist/react-datepicker.css";

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        height: '550px',
    },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

function ApptFormModal() {
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
    const [facilityOptions, setFacilityOpts] = useState([]); // form field value suggestions, names of facility in patient object
    const [provider, setProvider] = useState(''); // form field value
    const [providers, setProviders] = useState([]); // form field value suggestions, intersection of ptntProviders and facProviders (list of ids)
    const [providerTitle, setProviderTitle] = useState(''); // from field value
    const [error, setError] = useState(''); // error message
    const [showForm, setShowForm] = useState(false); // opens modal

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

    const { useDB, db } = useAuth();
    const patients = useDB('patients');
    const _facilities = useDB('facilities');

    //MODAL FUNCTIONS
    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#000';
    }

    function closeModal() {
        setIsOpen(false);
    }


    /* FORM INPUTS HANDLE CHANGE
    params: event, event.target,value (in this case patient field value)
    1) shows new patient form if patient is created
    2) grabs patient object and sets as global variable [ptntObj = {dict/obj}]
    3) sets the facility options if available in patient object [facilityOpts, setFacilityOpts = [array of names]] 
    4) pushes dict obj to _facs which stores an array of facility names and ids [{'id':fid, 'name':fac_obj['name']}]
    */
    function handlePatientChange(e) {
        const val = e.target.value; 
        setPatient(val);

        if (val == 'new-patient') { //create a new patient
            setShowForm(true);
        } else { // a patient is selected from dropdown
            setShowForm(false);

            //taking the patient field and splitting it into name and pid
            const pat_arr = val.split(", ");
            const pid = pat_arr[0];
            //const _patient = pat_arr[1];
            //using pid to filter the patient object and assign it to global variable 
            ptntObj = patients.filter(pVBT786TE 132QWECTB POIYTY75G4`tnt => ptnt.id == pid)[0];

            if (Object.keys(ptntObj).length != 0 && ptntObj['facilities'].length != 0) {
                setFacilityOpts(ptntObj['facilities'].map((fid) => {
                    const fac = _facilities.filter(fac => {
                        return fac.id === fid;
                    })[0]
                    if (!(typeof fac === 'undefined')) {
                        _facs.push({ 'id': fid, 'name': fac['name'] });
                        return fac['name'];
                    }
                    return false;
                }))

                (typeof ptntObj['facilities'] != 'undefined') && (ptntFacilities = ptntObj['facilities']);
                (typeof ptntObj['providers'] != 'undefined') && (ptntProviders = ptntObj['providers']);
            }

            /*
            setPtntObj(ptntObj => ({
                ...ptntObj, 
                ...patObj
            }));
            */
        }
    }

    /*
    params: event, event.target,value (in this case patient field value)
    1) matches name input w/ facility id in _facs array, makes a query to the database for the following info...
    providers if matched with patient's, and the address
    2) sets providers the input suggestions, and fills in the address field
    */
    function handleFacilityChange(e) { 
        const val = e.target.value; 
        setFacility(val);
        //grab the facility id from _facs array [{'id':fid, 'name':fac_obj['name']}]
        const fac = _facs.filter(fac => {
            return fac.name === val;
        })[0];
        //[choose a different value/method to represent a new facility not just a numeric "0" which could be unstable]
        //console.log('FAC ID', fac_id['id'])
        if(fac) {
            facObj = _facilities.filter(fac => fac.id == facilityId)[0];
            //facObj = fac_arr.length > 0 ? fac_arr[0] : null;
        }
        if (facObj != null) { // id == 0 means new facility 
            setAddress(facObj['address']);
            setProviders(facObj['providers'].filter((p, i) => {
                return ptntObj['providers'].includes(p);
            })); // set to fac_provs x ptnt_provs

            //facAddress = facObj['address']; 
            //facProviders = facObj['providers'];
        }
    }
    
    //place inside of html
    function provInputChange(data) {
        const prov_ = data.split(";");
        setProvider(prov_[0]);
        setProviderTitle(prov_[1]);
        //setProviderTitle(title.substring(0, title_len-1))
        //setProvider(data)
    }


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


            console.log('ADDRESS', address, facObj['address'], !(address === facObj['address']));
            console.log('NOT KNOW TIME', notKnowTime, notKnowDuration, (!notKnowTime ? _time : 'poop'), (!notKnowDuration ? duration : 'poop'));

            //if facility field is left empty
            if (facility === '') {
                //create new appointment in db
                db.send({ 'patient': _patient, 'pid': pid, 'date': _date, 'time': _time, 'duration': (!notKnowDuration ? duration : ''), 'facility': facility, 'facilityId': facilityId, 'address': address, 'provider': provider + ';' + providerTitle, 'error': error }, 'appointments');
                setIsOpen(false);
            }


            //if facility does not exist...
            if (facility != '' && !(ptntFacilities.includes(facilityId))) {
                db.send({ 'name': facility, 'address': address, 'providers': [...fac_obj['providers'], provider + ';' + providerTitle] }, 'facilities').then(function (docRef) {
                    Promise.all([
                        //edit patient['facilities] array in db if provider does not exist
                        !(ptntProviders.includes(provider + ';' + providerTitle)) && db.edit(pid, { 'facilities': [...ptntFacilities, docRef.id], 'providers': [...ptntProviders, provider + ';' + providerTitle] }, 'patients'),
                        //create new appointment in db
                        db.send({ 'patient': _patient, 'pid': pid, 'date': _date, 'time': _time, 'duration': duration, 'facility': facility, 'facilityId': docRef.id, 'address': address, 'provider': provider + ';' + providerTitle, 'error': error }, 'appointments')
                    ]);
                    setIsOpen(false);
                });
            }

            //if facility exists...
            if (facility != '' && ptntFacilities.includes(facilityId)) {
                console.log(ptntFacilities);
                db.send({ 'patient': _patient, 'pid': pid, 'date': _date, 'time': _time, 'duration': (!notKnowDuration ? duration : ''), 'facility': facility, 'facilityId': facilityId, 'address': address, 'provider': provider, 'error': error }, 'appointments').then(function (docRef) {
                    Promise.all([
                        !(providers.includes(provider + ';' + providerTitle)) && db.edit(pid, { 'providers': [...ptntProviders, provider + ';' + providerTitle] }, 'patients'),
                        !(providers.includes(provider + ';' + providerTitle)) && db.edit(facilityId, { 'providers': [...fac_obj['providers'], provider + ';' + providerTitle] }, 'facilities'),
                        !(address === facObj['address']) && db.edit(facilityId, { 'address': address }, 'facilities'),
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



    return (<div className="form-modal">

        <button onClick={openModal}>Open Modal</button>
        <Modal
            isOpen={modalIsOpen}
            style={customStyles}
            contentLabel="Example Modal"
        >
            <div className="portfolio-modal">
                <div>
                    <div className="modal-row">
                        <h3>New Appointment</h3>
                        <button className="modal-button" onClick={closeModal}>Cancel</button>
                    </div>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <form onSubmit={e => { handleSubmit(e) }} onKeyDown={(e) => checkKeyDown(e)} className='appt-form'>
                        <label>
                            <p>Patient:</p>
                            <select value={patient} onChange={e => { handlePatientChange(e) }}>
                                <option value='select'>Select a patient</option>
                                <option value='new-patient'>Add a new patient</option>
                                {patients.map((p, i) => {
                                    return <option value={p.id + ', ' + p.firstName + ' ' + p.lastName}>{((p.firstName + p.lastName) ? (p.firstName + ' ' + p.lastName) : 'name not entered') + ' (' + p.id + ')'} </option>
                                })}
                            </select>
                        </label>

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
                            <TextField id="outlined-basic" label="Address" variant="outlined" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} disabled={(notKnowDuration) ? true : false} value={address} onChange={e => setAddress(e.target.value)} />
                        </label>

                        <label>
                            Facility
                            <Autocomplete suggestions={facilityOptions} setFormValue={e => { handleFacilityChange(e) }} formValue={facility} />
                        </label>

                        <label>
                            <p>Address</p>
                            <TextField id="outlined-basic" label="Address" variant="outlined" value={address} onChange={e => setAddress(e.target.value)} />
                        </label>

                        <label>
                            Provider's Full Name
                            <Autocomplete suggestions={providers.reduce(function (filtered, option) {
                                if (option.length > 1) {
                                    let split = option.split(";")
                                    filtered.push(split[0] + " (" + split[1] + ")")
                                    console.log('OPTION: ', split[0] + " (" + split[1] + ")")
                                }
                                return filtered;
                            }, [])} setFormValue={provInputChange} formValue={facility} />
                        </label>

                        <label>
                            Provider's Title (i.e., doctor, nurse, physical therapist):
                            <Autocomplete suggestions={['Doctor', 'Nurse', 'Physical Therapist', 'Dentist']} setFormValue={setProviderTitle} formValue={providerTitle} />
                        </label>

                        <input className="submit-bttn" type="submit" value="Submit" disabled={(showForm) ? "disabled" : ""} />
                    </form>
                </div>
            </div>
        </Modal>

    </div>);

}

export default ApptFormModal;

/*
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