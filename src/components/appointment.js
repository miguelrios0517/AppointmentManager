import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

function Appointment() {
    let { id } = useParams();

    return(
        <div className = "appointment-item">
            <header className = 'header'>Appointment</header>
            <div className = "main main-appointments">
                Appointment ID #{id}
            </div>
        </div>
    );
}

export default Appointment; 