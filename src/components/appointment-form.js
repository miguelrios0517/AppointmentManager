// use apptForm instead of this


import React from 'react';
import {Form, Button, Card, Alert} from 'react-bootstrap'

class appointmentForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {patient: '', date: '', time: '', notKnowDuration: false, duration: '', location : '', address: '', provider: '', id: '', map: {}, apptform: {}, notes:[], error:''};
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
      
      //checking if time is filled in 
      if (this.state.time == '' && this.state.duration != '')  {
        return this.setState({error: 'Please enter a time or leave duration blank'})
      } 

      //checking if date is filled in
      if (this.state.date == '')  {
        return this.setState({error: 'Please enter a date'})
      } 

      this.setState({error: ''}, () => {
        this.newFormSubmit(this.state)
        this.setState({patient: '', date: '', time: '', location : '', address: '', provider: ''});
      })
    }
  
    render() {
      return (
        <div>
          {this.state.error && <Alert variant="danger">{this.state.error}</Alert>}
          <form onSubmit={this.handleSubmit} className = 'appt-form'>
            <label>
              Patient Full Name: 
              <input name="patient" type="text" value={this.state.patient} onChange={this.handleChange} />
            </label>
            <label>
              Date:
              <input name="date" type="date" value={this.state.date} onChange={this.handleChange} />
            </label>
            <label>
              Time:
              <input name="time" type="time" value={this.state.time} onChange={this.handleChange} />
            </label>
            <label>
              Don't know duration?
              <input name="notKnowDuration" type="checkbox" checked={this.state.notKnowDuration} onChange={this.handleChange} />
            </label>
            <label>
              Duration (in minutes):
              <input name="duration" type="number" value={this.state.duration} onChange={this.handleChange} disabled = {(this.state.notKnowDuration)? "disabled" : ""}/>
            </label>
            <label>
              Location:
              <input name="location" type="text" value={this.state.location} onChange={this.handleChange} />
            </label>
            <label>
              Address
              <input name="address" type="text" value={this.state.address} onChange={this.handleChange} />
            </label>
            <label>
              Provider
              <input name="provider" type="text" value={this.state.provider} onChange={this.handleChange} />
            </label>
            <input className = "submit-bttn" type="submit" value="Submit" />
          </form>
        </div>

      );
    }
  }
  
  export default appointmentForm;