import React, { Component } from 'react';

import patientProfile from '../images/patient_profile.jpg'; // Tell webpack this JS file uses this image
import headacheIcon from '../icons/disease_injury/icons8-alzheimer-100.png'; 
import backacheIcon from '../icons/disease_injury/icons8-back-100.png';
import bloodPressureIcon from '../icons/disease_injury/icons8-blood-100.png';
import mentalHealthIcon from '../icons/disease_injury/icons8-depression-100.png';


function ApptPreview(props) {
      return (  
        <div className="w-2/5 px-3 py-3 border-solid border-2" id = "next-appointment">
          <div className="flex nowrap items-center" id = "row1">
            <div className="h-24 w-24 mr-3" id="patient-image">
              <img className="object-contain rounded-full" src={patientProfile} alt="Patient profile" />
            </div>
            <div id="patient-info">
              <h1 className="text-xl" id="patient-name">Steven E. Seagen</h1>
              <h1 className="text-sm mb-0" id="appt-date">At 12:15 PM (in 1 hour)</h1>
              <h2 className="text-sm" id="patient-dem">Male - 32 years</h2>
            </div>
          </div>
          <div className="flex nowrap justify-between border-b-2" id = "row2">
            <div className = "flex-col">
              <div className="h-8 w-8" id = "icon1"><img src={headacheIcon} className="object-contain" alt="Headache icon"/></div>
              <p className="text-sm mb-0">Migrane</p>
            </div>
            <div className = "flex-col">
              <div className="h-8 w-8" id = "icon2"><img src={backacheIcon} className="object-contain" alt="Headache icon"/></div>
              <p className="text-sm mb-0">Back pain</p>
            </div>
            <div className = "flex-col">
              <div className="h-8 w-8" id = "icon3"><img src={bloodPressureIcon} className="object-contain" alt="Headache icon"/></div>
              <p className="text-sm mb-0">High blood pressure</p>
            </div>
            <div className = "flex-col">
              <div className="h-8 w-8" id = "icon4"><img src={mentalHealthIcon} className="object-contain" alt="Headache icon"/></div>
              <p className="text-sm mb-0">Depression</p>
            </div>
          </div>
          <div id = "row3 nowrap">
              <div className="flex justify-between" id = "text-row1">
                <h3 className="text-sm">Location</h3>
                <div className="w-3/4">
                  <p className="text-sm"><span className="providerName">Dr. Kimberly</span> (room 102) at <span className="facilityName">Harborview Medical Center</span></p> 
                </div>              
              </div>
              <div className="flex justify-between" id = "text-row2">
                <h3 className="text-sm">Notes</h3>
                <div className="w-3/4">
                  <p className="text-sm">Ask the receptionist to sign off on old forms that were missed</p> 
                </div>              
              </div>              
          </div>
        </div> 
      );
    }

export default ApptPreview;