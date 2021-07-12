
import React from 'react';
import {Form, Button, Card, Alert} from 'react-bootstrap'

class PatientForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {firstName: '', lastName: '', email: '', phoneNum: '', provider: '', id: '', notes:[], forms: {}, error:''};
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
  
  export default PatientForm;