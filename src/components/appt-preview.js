import React, { Component } from 'react';


function ApptPreview(props) {
      return (
        <div className = "appt-preview top-box box">
            <h1 className = "title">Your {props.isApptHappening? 'current' : 'next'} appointment</h1>
        </div>
      );
    }

export default ApptPreview;