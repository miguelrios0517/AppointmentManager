import React from 'react';
import {Form, Button, Card, Alert} from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { useState, useEffect } from 'react';

import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

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
    const [facilityAdd, setFacilityAdd] = useState('');
    const [providerOne, setProviderOne] = useState('');
    const [providerTwo, setProviderTwo] = useState('');
    const [providerThree, setProviderThree] = useState('');
    const [providerFour, setProviderFour] = useState('');
    const [providerFive, setProviderFive] = useState('');
    const [providerOneTitle, setProviderOneTitle] = useState('');
    const [providerTwoTitle, setProviderTwoTitle] = useState('');
    const [providerThreeTitle, setProviderThreeTitle] = useState('');
    const [providerFourTitle, setProviderFourTitle] = useState('');
    const [providerFiveTitle, setProviderFiveTitle] = useState('');
    const [provNums, setProvNums] = useState(0);
    const [providerEmail, setProviderEmail] = useState('');
    const [providerPhone, setProviderPhone] = useState('');
    const [error, setError] = useState('');
    const { db } = useAuth()
    var _facility;
    var _provNums = ['one', 'two', 'three', 'four', 'five']

  
    const handleSubmit = (e) => {
      setError('')
      e.preventDefault();
      var providers = [(providerOne?providerOne:'')+';'+(providerOneTitle?providerOneTitle:''), 
      providerTwo+';'+providerTwoTitle,
      providerThree+';'+providerThreeTitle,
      providerFour+';'+providerFourTitle,
      providerFive+';'+providerFiveTitle,]

      db.send({'name': facility, 'address':facilityAdd, 'providers': providers}, 'facilities').then(function(docRef) {
        db.send({'firstName': firstName, 'middleInitial':middleInitial, 'lastName': lastName, 'email':email, 'phoneNum':phoneNum, 'facilities':[docRef.id], 'providers':providers}, 'patients').then(function(docRef) {
          props.setShowForm(false) }) 
        })

      //{'name':provider, 'title':providerTitle, 'email':providerEmail, 'phone':providerPhone
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
                <div>---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---</div>
                <label>
                Facility: 
                <input name="facility" type="text" value={facility} onChange={e => setFacility(e.target.value)} />
                </label>
                <label>
                Facility Address (street, city, zip state) 
                <input name="facAddress" type="text" value={facilityAdd} onChange={e => setFacilityAdd(e.target.value)} />
                </label>
                <label>
                Facility Phone Number:
                <input name="facPhoneNum" type="text" value={providerPhone} onChange={e => setProviderPhone(e.target.value)} />
                </label>
                <label>
                Facility Contact Email:
                <input name="facEmail" type="text" value={providerEmail} onChange={e => setProviderEmail(e.target.value)} />
                </label>
                

                {provNums >= 1 ? 
                    <div>
                      <div>
                      <div>-  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -</div>
                        <label>
                        Provider #1:
                        <input name="email" type="text" value={providerOne} onChange={e => {setProviderOne(e.target.value)}} />
                        </label>
                        <label>
                        Provider #1 Title (i.e., doctor, nurse, physical therapist):
                        <Autocomplete
                          id="free-solo-demo"
                          freeSolo
                          value={providerOneTitle}
                          onInputChange={(e, data) => {
                            setProviderOneTitle(data)
                            
                          }}
                          options={['Doctor', 'Nurse', 'Physical Therapist', 'Dentist']}
                          renderInput={(params) => (
                            <TextField {...params} label="freeSolo" margin="normal" variant="outlined" />
                            )}/>
                        </label>
                      </div>
                    </div>
                  :null}

                {provNums >= 2 ? 
                    <div>
                      <div>-  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -</div>
                      <label>
                      Provider #2:
                      <input name="email" type="text" value={providerTwo} onChange={e => {setProviderTwo(e.target.value)}} />
                      </label>
                      <label>
                      Provider #2 Title (i.e., doctor, nurse, physical therapist):
                      <Autocomplete
                        id="free-solo-demo"
                        freeSolo
                        value={providerTwoTitle}
                        onInputChange={(e, data) => {
                          setProviderTwoTitle(data)
                          
                        }}
                        options={['Doctor', 'Nurse', 'Physical Therapist', 'Dentist']}
                        renderInput={(params) => (
                          <TextField {...params} label="freeSolo" margin="normal" variant="outlined" />
                          )}/>
                      </label>
                    </div>
                  :null}
                

                {provNums >= 3 ?
                  <div>
                    <div>-  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -</div>
                    <label>
                    Provider #3 :
                    <input name="email" type="text" value={providerThree} onChange={e => {setProviderThree(e.target.value)}} />
                    </label>
                    <label>
                    Provider #3 Title (i.e., doctor, nurse, physical therapist):
                    <Autocomplete
                      id="free-solo-demo"
                      freeSolo
                      value={providerThreeTitle}
                      onInputChange={(e, data) => {
                        setProviderThreeTitle(data)
                        
                      }}
                      options={['Doctor', 'Nurse', 'Physical Therapist', 'Dentist']}
                      renderInput={(params) => (
                        <TextField {...params} label="freeSolo" margin="normal" variant="outlined" />
                        )}/>
                    </label>
                  </div>
                :null}

                {provNums >= 4 ?
                  <div>
                    <div>---------------------------------------------------------------------------</div>
                    <label>
                    Provider #4 :
                    <input name="email" type="text" value={providerFour} onChange={e => {setProviderFour(e.target.value)}} />
                    </label>
                    <label>
                    Provider #4 Title (i.e., doctor, nurse, physical therapist):
                    <Autocomplete
                      id="free-solo-demo"
                      freeSolo
                      value={providerFourTitle}
                      onInputChange={(e, data) => {
                        setProviderFourTitle(data)
                        
                      }}
                      options={['Doctor', 'Nurse', 'Physical Therapist', 'Dentist']}
                      renderInput={(params) => (
                        <TextField {...params} label="freeSolo" margin="normal" variant="outlined" />
                        )}/>
                    </label>
                  </div>
                :null}

              {provNums >= 5 ?
                  <div>
                    <div>-  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -</div>
                    <label>
                    Provider #5 :
                    <input name="email" type="text" value={providerFive} onChange={e => {setProviderFive(e.target.value)}} />
                    </label>
                    <label>
                    Provider #5 Title (i.e., doctor, nurse, physical therapist):
                    <Autocomplete
                      id="free-solo-demo"
                      freeSolo
                      value={providerFiveTitle}
                      onInputChange={(e, data) => {
                        setProviderFiveTitle(data)
                        
                      }}
                      options={['Doctor', 'Nurse', 'Physical Therapist', 'Dentist']}
                      renderInput={(params) => (
                        <TextField {...params} label="freeSolo" margin="normal" variant="outlined" />
                        )}/>
                    </label>
                  </div>
                :null}
                
                {provNums>=1? <div onClick = {() => setProvNums(provNums-1)} className = "new-appt-bttn">Delete provider</div>:null }
                <br/>
                {provNums<5? <div onClick = {() => setProvNums(provNums+1)} className = "new-appt-bttn">Add a provider</div>:null }
                

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
