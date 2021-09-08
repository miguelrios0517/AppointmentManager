import React from 'react';
import {Form, Button, Card, Alert} from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react';
//import { FacilityForm } from './fac_form';

//left of trying to figure out schema 
// so far facilities fields are name, address, providers, and phone numbers
// should providers be its own collection or be stored within facilities
// how should providers be stored inside of facilities
//    possible option: provider fields could be firstName, lastName, title(doctor, nurse, etc), phoneNum, email



export function ShortPtntForm(props) {
    const [firstName, setFirstName] = useState('');
    const [middleInitial, setMiddleInitial] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');
    const { db } = useAuth()
  
  const handleSubmit = (e) => {
    setError('')
    e.preventDefault();
    db.send({'firstName': firstName, 'middleInitial':middleInitial, 'lastName': lastName}, 'patients').then(function(docRef) {
        props.setPatient(docRef.id + ', ' + firstName + ' ' + lastName) })
    props.setShowForm(false)
}
    
    return (
        <div>
            <button onClick={() => { 
                props.setShowForm(false) 
                props.setPatient("select")
            }} className = "new-appt-bttn">Cancel</button>
            {error && <Alert variant="danger">{error}</Alert>}
            <form onSubmit={e => { handleSubmit(e) }} className = 'appt-form'>
                <label>
                First Name:
                <input name="firstName" type="text" value={firstName} onChange={e => setFirstName(e.target.value)}/>
                </label>
                <label>
                Middle Initial:
                <input name="middleInitial" type="text" value={middleInitial} maxlength="1" onChange={e => setMiddleInitial(e.target.value)}/>
                </label>
                <label>
                Last Name: 
                <input name="lastName" type="text" value={lastName} onChange={e => setLastName(e.target.value)} />
                </label>
                <input className = "submit-bttn" type="submit" value="Submit" />
            </form>
        </div>
      );
    }


export default function PtntForm(props) {
    const [firstName, setFirstName] = useState('');
    const [middleInitial, setMiddleInitial] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNum, setPhoneNum] = useState('');
    const [facility, setFacility] = useState('');
    const [provider, setProvider] = useState('');
    const [error, setError] = useState('');
    const { db } = useAuth()
    var _facility;

    const handleFacForm = (e) => {
      //error handling
      e.preventDefault();
      console.log(e.value)
      //db.send({'firstName': firstName, 'middleInitial':middleInitial, 'lastName': lastName, 'email':email, 'phoneNum':phoneNum, 'facilities':facility, 'providers': providers}, 'patients').then(function(docRef) {
       // props.setShowForm(false)})
    }
    
  
    const handleSubmit = (e) => {
      setError('')
      e.preventDefault();
      db.send({'firstName': firstName, 'middleInitial':middleInitial, 'lastName': lastName, 'email':email, 'phoneNum':phoneNum, 'facilities':facility, 'provider':provider}, 'patients').then(function(docRef) {
          props.setShowForm(false)
      })
    }
    
    return (
        <div>
            {error && <Alert variant="danger">{error}</Alert>}
            <form onSubmit={e => { handleSubmit(e) }} className = 'appt-form'>
                <label>
                First name:
                <input name="firstName" type="text" value={firstName} onChange={e => setFirstName(e.target.value)}/>
                </label>
                <label>
                Middle initial:
                <input name="middleInitial" type="text" value={middleInitial} maxlength="1" onChange={e => setMiddleInitial(e.target.value)}/>
                </label>
                <label>
                Last name: 
                <input name="lastName" type="text" value={lastName} onChange={e => setLastName(e.target.value)} />
                </label>
                <label>
                Phone number:  
                <input name="phoneNum" type="text" value={phoneNum} onChange={e => setPhoneNum(e.target.value)} />
                </label>
                <label>
                Email: 
                <input name="email" type="text" value={email} onChange={e => setEmail(e.target.value)} />
                </label>
                <br/>
                <input className = "new-appt-bttn" type="submit" value="Submit" />
            </form>
        </div>
      );
}
  
/*
 <label>
                Facility: 
                <input name="facility" type="text" value={facility} onChange={e => setFacility(e.target.value)} />
                </label>
                <label>
                Provider: 
                <input name="provider" type="text" value={provider} onChange={e => setProvider(e.target.value)} />
                </label>
*/


/*



class PatientForm extends React.Component {
    constructor(props) {
      super(props);
      this.showForm = props.showForm;
      this.newFormSubmit = props.newFormSubmit;
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
      this.setState ({[name]: value});
    }
  
    handleSubmit(event) {
      event.preventDefault();

      this.setState({error: ''}, () => {
        this.newFormSubmit(this.state)
        this.setState({firstName: '', lastName: '', email: '', phoneNum: '', provider: ''});
      })
    }
  
    render() {
      return (
        <div>
          {this.state.error && <Alert variant="danger">{this.state.error}</Alert>}
          <form onSubmit={this.handleSubmit} className = 'appt-form'>
            <label>
              First Name:
              <input name="firstName" type="text" value={this.state.firstName} onChange={this.handleChange} />
            </label>
            <label>
              Last Name: 
              <input name="lastName" type="text" value={this.state.lastName} onChange={this.handleChange} />
            </label>
            <label>
              Phone Number:  
              <input name="phoneNum" type="text" value={this.state.phoneNum} onChange={this.handleChange} />
            </label>
            <label>
              Email: 
              <input name="email" type="text" value={this.state.email} onChange={this.handleChange} />
            </label>
            <label>
              Provider: 
              <input name="provider" type="text" value={this.state.provider} onChange={this.handleChange} />
            </label>
            <input className = "submit-bttn" type="submit" value="Submit" />
          </form>
        </div>

      );
    }
  }
  */
