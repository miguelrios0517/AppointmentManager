
import React from 'react';
import {Form, Button, Card, Alert} from 'react-bootstrap'

class appointmentForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {patient: '', date: '', time: '', duration: '', location : '', address: '', provider: '', id: '', map: {}, apptform: {}, notes:[], error:''};
      this.showForm = props.showForm;
      this.newFormSubmit = props.newFormSubmit;
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      const name = event.target.name;
      this.setState ({[name]: event.target.value});
    }
  
    handleSubmit(event) {
      console.log(this.state.error)
      this.setState({error: ''})
      event.preventDefault();
      
      //checking if time is filled in 
      if (this.state.time == '' && this.state.duration != '')  {
        console.log('error')
        return this.setState({error: 'Please enter a time or leave duration blank'})
      } 

      //checking if date is filled in
      if (this.state.date == '')  {
        console.log('error')
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
              Duration (in minutes):
              <input name="duration" type="number" value={this.state.duration} onChange={this.handleChange} />
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