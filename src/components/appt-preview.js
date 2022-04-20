import React, { Component } from 'react';

import patientProfile from '../images/patient_profile.jpg'; // Tell webpack this JS file uses this image
import headacheIcon from '../icons/disease_injury/icons8-alzheimer-100.png'; 
import backacheIcon from '../icons/disease_injury/icons8-back-100.png';
import bloodPressureIcon from '../icons/disease_injury/icons8-blood-100.png';
import mentalHealthIcon from '../icons/disease_injury/icons8-depression-100.png';
import more from '../icons/more.png';


import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Button from '@mui/material/Button';

/*
Todo list:
- next appointment -> get directions
- current appointment -> view forms

add arrows at the top to scroll through the appointments
*/


function ApptPreview(props) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

      return (  
        <div className="w-2/5 px-4 py-4 border-solid border-2 rounded-lg" id = "next-appointment">
          <div className="flex nowrap items-center mb-3 justify-between" id = "row1">
            <div className="flex items-center ">
              <div className="h-24 w-24 mr-3" id="patient-image">
                <img className="object-contain rounded-full" src={patientProfile} alt="Patient profile" />
              </div>
              <div id="patient-info">
                <h1 className="text-xl" id="patient-name">Steven E. Seagen</h1>
                <h1 className="text-sm mb-0" id="appt-date">At 12:15 PM (in 1 hour)</h1>
                <h2 className="text-sm" id="patient-dem">Male - 32 years</h2>
              </div>
            </div> 
            <div></div>
            <div className="h-7 w-7" id = "icon2"><button ref={anchorRef}><img src={more} onClick={handleToggle} className="object-contain" alt="see more"/></button></div>
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              placement="bottom-end"
              transition
              disablePortal
            >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === 'bottom-end' ? 'left top' : 'left bottom',
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList
                      autoFocusItem={open}
                      id="composition-menu"
                      aria-labelledby="composition-button"
                    >
                      <MenuItem onClick={handleClose}>Appointment</MenuItem>
                      <MenuItem onClick={handleClose}>Directions</MenuItem>
                      <MenuItem onClick={handleClose}>Patient</MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
          </div>
          <div className="flex nowrap justify-between border-b-2 mb-3" id = "row2">
            <div className = "myFlexCol">
                <div className="h-8 w-8 mb-1" id = "icon1"><img src={headacheIcon} className="object-contain" alt="Headache icon"/></div>
                <p className="text-sm mb-2.5">Migrane</p>
            </div>
            <div className = "myFlexCol">
              <div className="h-8 w-8 mb-1" id = "icon2"><img src={backacheIcon} className="object-contain" alt="Headache icon"/></div>
              <p className="text-sm mb-2.5 text-center">Back pain</p>
            </div>
            <div className = "myFlexCol">
              <div className="h-8 w-8 mb-1" id = "icon3"><img src={bloodPressureIcon} className="object-contain" alt="Headache icon"/></div>
              <p className="text-sm mb-2.5 text-center">High pressure</p>
            </div>
            <div className = "myFlexCol">
              <div className="h-8 w-8 mb-1" id = "icon4"><img src={mentalHealthIcon} className="object-contain" alt="Headache icon"/></div>
              <p className="text-sm mb-2.5">Depression</p>
            </div>
          </div>
          <div id = "row3 nowrap">
              <div className="flex justify-between" id = "text-row1">
                <h3 className="text-sm">Location</h3>
                <div className="w-80">
                  <p className="text-sm"><span className="providerName">Dr. Kimberly</span> (room 102) at <span className="facilityName">Harborview Medical Center</span></p> 
                </div>              
              </div>
              <div className="flex justify-between" id = "text-row2">
                <h3 className="text-sm mb-0">Notes</h3>
                <div className="w-80">
                  <p className="text-sm mb-0">Ask the receptionist to sign off on old forms that were missed</p> 
                </div>              
              </div>              
          </div>
        </div> 
      );
    }

export default ApptPreview;