import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from "./datatablesource";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from '../contexts/AuthContext'



const apptColumns = [
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
    width: 130,
  },

  {
    field: "formattedTime",
    headerName: "Time",
    width: 100,
  },
  {
    field: "facility",
    headerName: "Facility",
    width: 140,
  },
  { field: "formattedProvider", headerName: "Provider", width: 140 },
  { field: "address", headerName: "Address", width: 140 },
  { field: "id", headerName: "ID", width: 40 },
];



const Appointments = () => {
  const { db, useDB } = useAuth();
  const appointments = useDB('appointments');
  const [data, setData] = useState([]);

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
    appt['formattedProvider'] = appt.provider.name + ((appt.provider.title != '')?(' (' + appt.provider.title + ')'):'')
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
    appt['formattedTime'] = hour + ":" + minutes + " " + period
    //let dateString = appt.date.toDate().toString()
    //dateString = dateString.substring(0,15)
    appt['formattedDate'] = appt.date.toDate().toString().substring(0,15)
    /*setTimeout(() => {
        delete appt['date']
    }, 300)*/
    //return appt
  })

  console.log('APPOINTMENTS FORMATED', appointments)

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Add New User
        <Link to="/appointments-new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows = {appointments} 
        columns={apptColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
    </div>
  );
};

export default Appointments;
