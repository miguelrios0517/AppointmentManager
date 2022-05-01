import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from "./datatablesource";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from '../contexts/AuthContext'
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const dayInMonthComparator = (v1, v2) => {
  console.log(new Date(v1), new Date(v2))
  return new Date(v1) - new Date(v2)
};

const appointmentColumns = [
  {
    field: "patient",
    headerName: "Patient",
    width: 100,
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
    field: "formattedDate",
    headerName: "Date",
    //valueGetter: (params) => params.row.dateCreated,
    width: 140,
    type: 'date',
    sortComparator: dayInMonthComparator,
    valueFormatter: (params) => {
      if (params.value == null) {
        return '';
      }
      return params.value.substring(0,15)
    },
  },

  {
    field: "formattedTime",
    headerName: "Time",
    width: 100,
    sortable: false,
  },
  {
    field: "facility",
    headerName: "Facility",
    width: 140,
  },
  { field: "formattedProvider", headerName: "Provider", width: 165 },
  { field: "address", headerName: "Address", width: 165 },
  { field: "id", headerName: "ID", width: 50 },
];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Appointments = () => {
  const { db, useDB } = useAuth();
  const appointments = useDB('appointments');
  const [data, setData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  console.log('ALL APPOINTMENTS', appointments)

  const handleDelete = (id) => {
    db.delete(id, 'appointments');
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to={`/appointments/${params.row.id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  /*appointments.forEach((appt) => {
    console.log('CURRENT APPOINTMENT',appt)
    let prov = appt.provider.name + ' (' + appt.provider.title + ')'
    let time = ''
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
      time = hour + ":" + minutes + " " + period         
    } else {
        console.log('time does not exist')
    }
    console.log('DATE',appt.date)
    let date = appt.date.toDate().toString().substring(0,15)
    let row = {'patient':appt.patient, 'date':date, 'time':time, 'facility':appt.facility, 'provider':appt.prov, 'address':appt.address}
    console.log('SETTING DATA', row)
    setData(old => [...old, row])
  })*/

  appointments.forEach((appt) => {
    //delete appt['pid']
    //delete appt['facilityId']
    //delete appt['uid']
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
    let formattedTime = hour + ":" + minutes + " " + period
    appt['formattedTime'] = formattedTime 
    //let dateString = toDate().toString().substring(0,15)
    let dateFormatted = new Date(appt.date.replace(/-/g, '\/'))
    dateFormatted = dateFormatted.toString().substring(0,15) + ' ' + formattedTime
    appt['formattedDate'] = dateFormatted;
    appt['formattedProvider'] = appt.provider.name + ((appt.provider.title != '')?(' (' + appt.provider.title + ')'):'')
    //.toString().substring(0,15)
    /*setTimeout(() => {
        delete appt['date']
    }, 300)*/
    //return appt
  })

  console.log('APPOINTMENTS FORMATED', appointments)

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Appointments
        <div className="flex row"> 
          <div className="link mr-2">
            <Link to="/appointments-new" className="link-text" style={{ textDecoration: 'none' }}>
              New Appointment
            </Link>
          </div>
          <button onClick={handleOpen} className="link mr-3">
            Import CSV
          </button>
        </div>
      </div>
      <DataGrid
        className="datagrid"
        rows = {appointments} 
        columns={appointmentColumns.concat(actionColumn)}
        initialState={{
          sorting:{
            sortModel:[
              {
                field: 'formattedDate',
                sort: 'desc',
              }
            ]
          }
        }}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Import your data
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Import a csv file of your appointments with the following header columns: patient, date, time, duration, facility, provider, and address 
            </Typography>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default Appointments;
