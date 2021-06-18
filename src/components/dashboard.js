import React, { Component, useState } from 'react';
import ApptPreview from './appt-preview';
import ApptCarousel from './appt-carousel';
import ToDo from './to-do'; 
import Sidebar from './sidebar'
import { LocalDiningOutlined, PinDropSharp } from '@material-ui/icons';
import { Card, Alert, Button } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'

export default function Dashboard(props) {
    const [error, setError] = useState('')
    const { currentUser, logout } = useAuth()
    const history = useHistory()

    async function handleLogout() {
        setError('')

        try {
            await logout()
            history.push('/login')
        } catch {
            setError('Failed to log out')
        }

    }

    

    return(
        <div className = "dashboard"> 
            <header className = 'header'>Dashboard Overview</header>
            <div className = "authTutor">
                <Card>
                    <Card.Body>
                        <h2 className = "text-center mb-4">Profile</h2>
                        {error && <Alert variant = "danger">{error}</Alert>} 
                        <strong>Email: </strong> {currentUser? currentUser.email: null}
                        <Link to ="/update-profile" className="btn btn-primary w-100 mt-3"> Update Profile </Link>
                    </Card.Body> 
                </Card>
                <div className = "w-100 text-center mt-2">
                    <Button variant = "link" onClick={handleLogout}>Log Out</Button>
                </div>
            </div>
            <div className = "main">
                <ApptPreview appointments={props.appointments} />  
                <ToDo />
                <ApptCarousel />
            </div>
        </div>
    ); 
}

        
        