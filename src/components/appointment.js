import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext'

function Appointment() {
    let { id } = useParams();
    const { db, useDB } = useAuth()
    
    const appointment = useDB('appointments', id)

    

    return(
        <div className = "appointment-item">
            <header className = 'header'>Appointment View</header>
            <div className = "main main-appointments">
                ID #{id}
                <br/><br/>
                {appointment.length === 0? <p>There is no appointment to show</p>:
                        appointment.map((p, i) => {
                            return <div key={i}>
                                    <b>Patient:</b> {p.patient? p.patient:''} <br/>
                                    <b>Date:</b> {p.date? p.date.toDate().toString().substring(0,15): ''} <br/>
                                    <b>Facility:</b> {p.facility? p.facility: ''} <br/>
                                    <b>Provider:</b> {p.provider? p.provider.name + ((p.provider.title != '')?(' (' + p.provider.title + ')'):''): 'n/a'} <br/>
                                    <b>Duration:</b> {p.duration? p.duration + 'minutes': ''} <br/>
                                    <b>Address:</b> {p.address? p.address: ''} <br/>
                                    <b>Notes:</b>
                                </div> 
                        })
                }
            </div>
        </div>
    );
}

export default Appointment;  

/*
                                <b>Duration:</b> {p.duration? p.duration + 'minutes': 'n/a'} <br/>
                                <b>Address:</b> {p.address? p.address: 'n/a'} <br/>
                                <b>Notes:</b> {'n/a'}
*/