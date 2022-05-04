import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useRouteMatch
  } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext'
import PtntForm from './ptnt_form_old.js';
import app from "../firebase"
import { DataGrid } from "@mui/x-data-grid";

const Patients = () => {
    const { db, useDB } = useAuth();
    const patients = useDB('patients')
    
    const handleDelete = (id) => {  
      db.delete(id, 'patients');
    };
  
    console.log('ALL PATIENTS', patients)

    patients.forEach((pat)=> {
      pat['name'] = pat.firstName + (pat.middleInitial != ''? (' ' + pat.middleInitial): '')  + ' ' + pat.lastName
      pat['primaryFacName'] = pat.primaryFacility.name 
      pat['primaryProvFormatted'] = pat.primaryProvider.name + ((pat.primaryProvider.title != '')?(' (' + pat.primaryProvider.title + ')'):'')
    })
   
    const patientColumns = [
      {
        field: "name",
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
        field: "phoneNumber",
        headerName: "Phone Number",
        width: 150,
      },
    
      {
        field: "email",
        headerName: "Email",
        width: 150,
      },
      {
        field: "primaryFacName",
        headerName: "Primary Facility",
        width: 150,
      },
      { field: "primaryProvFormatted", headerName: "Primary Provider", width: 150 },
      { field: "id", headerName: "ID", width: 150 },
  ];
  
    const actionColumn = [
      {
        field: "action",
        headerName: "Action",
        width: 200,
        renderCell: (params) => {
          return (
            <div className="cellAction">
              <Link to={`/patients/${params.row.id}`} style={{ textDecoration: "none" }}>
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
        <div className="datatable">
      <div className="datatableTitle">
        Patients
        <div className="flex row"> 
          <div className="link mr-2">
            <Link to="/patients-new" className="link-text" style={{ textDecoration: 'none' }}>
              Add A Patient
            </Link>
          </div>
        </div>
      </div>
      <DataGrid
        className="datagrid"
        rows = {patients} 
        columns={patientColumns.concat(actionColumn)}
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
    </div>
    );
  };
  

function Patients2() {
    const {path, url} = useRouteMatch();    
    const[showForm, setShowForm] = useState(false)
    const[ids, setIds] = useState([])
    const { db, useDB } = useAuth()

    const patients = useDB('patients')
    const facilities = useDB('facilities')
    let store = app.firestore()

    const pat = patients.filter(p => {
        return p.id === 'vvWEj7MpFyriKHdfHX1l'
    })

    function newFormSubmit(item) {
        db.send(item, 'patients')
        setShowForm(false)
    }

    function deletePatient(p) {
        console.log('ALL FACILITIES', p.facilities, p)
        p.facilities.forEach((fid) => {
            console.log('DELETING FACILITY', fid)
            db.delete(fid, 'facilities')
        })
        db.delete(p.id, 'patients')
    }
 
    return(
        <div className = "appointments"> 
            <header className = 'header'>Patients</header>
            <div className = "main main-appointments">
                <div className = "appt-list"> 
                        {patients.length === 0? <p>There are no patients to show. Click the button on the right to add a new patient.</p>: <></>}
                        {(patients.length !== 0) &&
                        <table className ="table-auto" style={{width:1200}}>
                                <tr>
                                    <th>Patient</th>
                                    <th>Phone Number</th>
                                    <th>Email</th>
                                    <th>Primary Facility</th>
                                    <th>Primary Provider</th>
                                    <th></th>
                                </tr>
                        {patients.map((p, i) =>  {
                            console.log('ADDING CURRENT PATIENT OBJ', p)
                            
                            /*
                            let primaryFacility = ''
                            let primaryProvider = ''
                            p.facilities.forEach((f)=> {
                                console.log('CURRENT FACILITY', f)
                                if(f.primary == true) {
                                    store.collection('facilities').doc(f.facility).get().then(snapshot => {
                                        console.log('PRIMARY FACILITY OBJ', f, snapshot.data())
                                        let fObj = snapshot.data()
                                        console.log('fOBJ', fObj)
                                        primaryFacility = fObj.name
                                        primaryProvider = (fObj.providers.length !=0) ? fObj.providers[0].provider + '(' + fObj.providers[0].providerTitle + ')': primaryProvider
                                        console.log('Primary Facility', primaryFacility, 'Primary Provider', primaryProvider)
                                    })
                                }
                            })*/

                            return(
                            <tr>
                                <td>{"firstName" in p?p.firstName:''}{"middleInitial" in p? ' ' + p.middleInitial + ' ':' '}{"lastName" in p?p.lastName:''}</td>
                                <td>{"phoneNumber" in p?p.phoneNumber:''}</td>
                                <td>{"email" in p?p.email:''}</td>
                                <td>{"primaryFacility" in p?p.primaryFacility.name: ''}</td>
                                <td>{"primaryProvider" in p?(p.primaryProvider.name + ((p.primaryProvider.title != '')?(' (' + p.primaryProvider.title + ')'):p.primaryProvider.title)): ''}</td>
                                <td><span onClick = {() => deletePatient(p)}>Delete</span> <Link to={`/patients/${p.id}`}>View</Link></td>
                            </tr>
                        )})}
                        </table>}
                </div>
                <div className = "main main-vertical">
                </div> 
                    <Link to = "/new-patient">
                        <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Add new patient</button>
                    </Link>
                </div>    
        </div>
        
    );
}

               

export default Patients;  
        
        