import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from "./datatablesource";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from '../contexts/AuthContext'


const Datatable = () => {
  const { db, useDB } = useAuth();
  const appointments = useDB('appointments');
  const [data, setData] = useState(userRows);
  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

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

  console.log('APPOINTMENTS FORMATED', appts)


  const userColumns = [
    {
      field: "patient",
      headerName: "Patient",
      width: 150,
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
      width: 150,
    },
  
    {
      field: "time",
      headerName: "Time",
      width: 150,
    },
    {
      field: "facility",
      headerName: "Facility",
      width: 150,
    },
    { field: "provider", headerName: "Provider", width: 150 },
    { field: "address", headerName: "Address", width: 150 },
];

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to="/users/test" style={{ textDecoration: "none" }}>
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
  return (
      <DataGrid
        className="datagrid"
        columns={userColumns}
        rows={data}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
  );
};

export default Datatable;
