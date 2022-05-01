//import "./datatable-preview.scss";
import "../datatable.scss"
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from "../datatablesource.js";
import { Link } from "react-router-dom";
import { useState } from "react";

const dayInMonthComparator = (v1, v2) => {
  console.log(new Date(v1), new Date(v2))
  return new Date(v1) - new Date(v2)
};

const appointmentColumns = [
  { field: "patient", headerName: "Patient", width: 130 },
  {
    field: "formattedDate",
    headerName: "Date",
    width: 110,
    type: 'date',
    sortComparator: dayInMonthComparator,
    valueFormatter: (params) => {
      if (params.value == null) {
        return '';
      }
      return params.value.substring(0,11)
    },
  },
  {
    field: "formattedTime",
    headerName: "Time",
    width: 80,
  },

  {
    field: "formattedProvider",
    headerName: "Provider",
    width: 130,
  },
  {
    field: "facility",
    headerName: "Facility",
    width: 130,
  },
  {
    field: "ID",
    headerName: "id",
    width: 0,
    hide: true,
  },
];

const DatatablePreview = (props) => {
  const [data, setData] = useState(userRows);

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  props.appointments.forEach((appt) => {
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


  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 60,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to={`/appointments/${params.row.id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
          </div>
        );
      },
    }, 
  ];
  return (
    <div className="datatable w-3/5 h-10 preview">
      <DataGrid
        className="datagrid"
        rows={props.appointments}
        columns={appointmentColumns.concat(actionColumn)}
        pageSize={5}
        rowsPerPageOptions={[5]}
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
      />
    </div>
  );
};

export default DatatablePreview;
