import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext'
import {Form, Button, Card, Alert} from 'react-bootstrap'

function Patient() {
    //const [patObj, setPatObj] = useState({'email':'', 'facilities':[],'firstName':'', 'lastName':'', 'midInit':'', 'phoneNum': ''})
    const [name, setName] = useState('')
    const [ error, setError ] = useState('')

    const { db, useDB } = useAuth()
    const patients = useDB('patients')
    const facilities = useDB('facilities')  

    let { id } = useParams();

    
    const pat_obj = patients.filter(ptnt => ptnt.id === id)[0]
    const first_name =  (pat_obj != undefined)? pat_obj['firstName']: null
    pat_obj != undefined && setPatObj({...patObj, 'firstName':first_name})
    //pat_obj != undefined && console.log(pat_obj['firstName'])

    
    



    return(
        <div className = "appointment-item">
            <header className = 'header'>Patient</header>
            {error && <Alert variant="danger">{error}</Alert>}
            <div className = "main main-appointments">
                Patient ID #{id}
            </div>
            <p></p>
        </div>
    );
}

export default Patient; 