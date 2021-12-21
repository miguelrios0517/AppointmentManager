import React, { useState, useEffect } from 'react';
//import Modal from 'react-awesome-modal';
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

import {Form, Button, Card, Alert} from 'react-bootstrap'
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
      width:'500px',
      height:'550px',
    },
  };

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');
  
function EmptyModalForm() {
    const[modalIsOpen, setIsOpen] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    var _facs = [];
    let subtitle;
  
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

    const handleInputChange = (e, data) => {
      setFacility(data);
      return data;
    };

    async function handleSubmit(e) {
        setIsOpen(false)
    }
  




    return (<div className = "form-modal">

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

                    <form onSubmit={e => { handleSubmit(e) }} className = 'appt-form'>
                    

                    <input className = "submit-bttn" type="submit" value="Submit" disabled = {(showForm)? "disabled" : ""}/>
                    </form>
            </div>
            </div>
      </Modal>

    </div>);

}

export default EmptyModalForm;  

/*



  
*/