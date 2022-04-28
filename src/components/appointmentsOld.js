import React, { useState, useEffect } from 'react';
import AppoinmentForm from './appointment-form.js';
//import ApptForm from './appt_form';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useRouteMatch
  } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext'
import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
//import { userColumns, userRows } from "../datatablesource";

const userColumns2 = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "user",
      headerName: "User",
      width: 230,
    },
    {
      field: "email",
      headerName: "Email",
      width: 230,
    },
  
    {
      field: "age",
      headerName: "Age",
      width: 100,
    },
    {
      field: "status",
      headerName: "Status",
      width: 160,
    },
  ];

const userColumns3 = [
    {
      field: "patient",
      headerName: "Patient",
      width: 230,
      /*renderCell: (params) => {
        return (
          <div className="cellWithImg">
            <img className="cellImg" src={params.row.img} alt="avatar" />
            {params.row.username}
          </div>
        );
      },*/
    },
    {
      field: "date",
      headerName: "Date",
      width: 230,
    },
  
    {
      field: "time",
      headerName: "Time",
      width: 100,
    },
    {
      field: "facility",
      headerName: "Facility",
      width: 160,
    },
    { field: "provider", headerName: "Provider", width: 70 },
    { field: "address", headerName: "Address", width: 70 },
];

let userRows = [
    {
      id: 1,
      username: "Snow",
      img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      status: "active",
      email: "1snow@gmail.com",
      age: 35,
    }
  ];
  

function Appointments() {
    const {path, url} = useRouteMatch();    
    const[showForm, setShowForm] = useState(false);
    const[ids, setIds] = useState([]);
    const[modalIsOpen, setIsOpen] = useState(false);
    const [providerTitle, setProviderTitle] = useState('');
    const { db, useDB } = useAuth();
    const appointments = useDB('appointments');
    console.log('ALL APPOINTMENTS', appointments)

    const appts = appointments.map((appt) => {
        //delete appt['pid']
        //delete appt['facilityId']
        //delete appt['uid']
        appt['provider'] = appt.provider.name + ' (' + appt.provider.title + ')'
        if (appt.time != null) {
            var period
            var hour = parseInt(appt.time.substring(0,2))
            var minutes = appt.time.substring(3,5)
            minutes = (minutes === '00')? minutes: parseInt(minutes)
            //console.log(hour>12)
            if (hour > 12) {
                hour = hour - 12 
                period = 'PM'
            }
            else {
                hour = (hour == 0)? 12: hour
                period = 'AM'
            }
            console.log('time exists', appt.time, hour + ":" + minutes + " " + period)            
        } else {
            console.log('time does not exist')
        }
        appt['time'] = hour + ":" + minutes + " " + period
        //let dateString = appt.date.toDate().toString()
        //dateString = dateString.substring(0,15)
        appt['date_'] = appt.date.toDate().toString().substring(0,15)
        setTimeout(() => {
            delete appt['date']
        }, 500)
        return appt
    })
    //console.log('CURRENT APPOINTMENTS', appointments)
    console.log('APPOINTMENTS FORMATED', appts)


    const userColumns = [
        {
        field: "patient",
        headerName: "Patient",
        width: 230,
        /*renderCell: (params) => {
            return (
            <div className="cellWithImg">
                <img className="cellImg" src={params.row.img} alt="avatar" />
                {params.row.username}
            </div>
            );
        },*/
        },
        {
        field: "date",
        headerName: "Date",
        width: 230,
        },
    
        {
        field: "time",
        headerName: "Time",
        width: 100,
        },
        {
        field: "facility",
        headerName: "Facility",
        width: 160,
        },
        { field: "provider", headerName: "Provider", width: 70 },
        { field: "address", headerName: "Address", width: 70 },
    ];

    
    
    


    /*function newFormSubmit(appointment) { 
        appointment.time = appointment.time? appointment.time: '00:00'
        appointment.date = appointment.date? new Date(appointment.date+ 'T' + appointment.time): null
        
        db.send(appointment, 'appointments')
        setShowForm(false)
    }*/

    function deleteAppointment(id) {
        db.delete(id, 'appointments');
    }

    
 
    return(
        <div className = "appointments"> 
            <header className = 'header'>Appointments</header>
            <div className = "main main-appointments">
            {(appointments.length ===  0)? <p>There are no appointments to show. Click the button below to add a new appointment.</p>:<></>}
                {(appointments.length !== 0) &&
                <table className = "table-auto" style={{width:1200}}>
                        <tr>
                            <th>Patient</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Facility</th>
                            <th>Address</th>
                            <th>Provider</th>
                            <th></th>
                        </tr>
                        {appointments.map((appt, i) => {

                            console.log('current appointment', appt)
                            console.log('date' in appt)
                            'date' in appt? console.log('date:' + appt.date): console.log('no date available')

                            //date cleanup
                            
                            if (appt.time != null) {
                                var period
                                var hour = parseInt(appt.time.substring(0,2))
                                var minutes = appt.time.substring(3,5)
                                minutes = (minutes === '00')? minutes: parseInt(minutes)
                                //console.log(hour>12)
                                if (hour > 12) {
                                    hour = hour - 12
                                    period = 'PM'
                                }
                                else {
                                    hour = (hour == 0)? 12: hour
                                    period = 'AM'
                                }
                                console.log('time exists', appt.time, hour + ":" + minutes + " " + period)            
                            } else {
                                console.log('time does not exist')
                            }
                                    
                            
                            

                            return <tr>
                                    <td>{"patient" in appt?appt.patient:'n/a'}({appt.pid?appt.pid:''})</td>
                                    <td>{("date" in appt)?appt.date.toDate().toString().substring(0,15):'n/a'}</td>
                                    <td>{"time" in appt?(hour + ":" + minutes + " " + period):'n/a'}</td>
                                    <td>{"facility" in appt?appt.facility:'n/a'}</td>
                                    <td>{"address" in appt?appt.address:'n/a'}</td>
                                    <td>{"provider" in appt?(appt.provider.name + ((appt.provider.title != '')?(' (' + appt.provider.title +')'): appt.provider.title)):'n/a'}</td>
                                    <td><span onClick = {() => deleteAppointment(appt.id)}>Delete</span> <Link to={`/appointments/${appt.id}`}>View</Link></td>
                                </tr>
                        })}
                    </table>
                    }

                    
            </div>    
            
            <Link to = "/new-appointment">
                <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Add new appointment</button>
            </Link>
            <DataGrid
                        className="datagrid"
                        columns={userColumns}
                        pageSize={9}
                        rowsPerPageOptions={[9]}
                        checkboxSelection
                    />
        </div>
    );
}

//<ApptForm setShowForm={setIsOpen}/>
               

export default Appointments;  