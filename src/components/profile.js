import React, {useState} from 'react';


import { Card, Alert, Button } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'

function Profile() {
    const [error, setError] = useState('')
    const { currentUser, logout } = useAuth()
    const history = useHistory()

    return(
        <div>
            <div className = "authTutor">
                <Card>
                    <Card.Body>
                        <h2 className = "text-center mb-4">Profile</h2>
                        {error && <Alert variant = "danger">{error}</Alert>} 
                        <strong>Email: </strong> {currentUser? currentUser.email: null}
                        <Link to ="/update-profile" className="btn btn-primary w-100 mt-3"> Update Profile </Link>
                    </Card.Body> 
                </Card>
            </div>
        </div>

    );
}

export default Profile; 
