import React, { useState, useEffect } from 'react';
//import Modal from 'react-awesome-modal';
import Autocomplete from './Autocomplete.js'
import Modal from 'react-modal';

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width:'500px',
      height:'550px',
    },
  };

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');
  
function Empty() {
    const[modalIsOpen, setIsOpen] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [fruit, setFruit] = useState('')
    let subtitle;
  
    function openModal() {
      setIsOpen(true);
    }
  
    function afterOpenModal() {
      // references are now sync'd and can be accessed.
      subtitle.style.color = '#000';
    }
  
    function closeModal() {
      setIsOpen(false);
    }

    async function handleSubmit(e) {
        setIsOpen(false)
    }

    return (<div className = "form-modal">

<button onClick={openModal}>Open Empty</button>
      <Modal
        isOpen={modalIsOpen}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="portfolio-modal">
            <div>
                <div className="modal-row">
                    <h3>Emty Modal</h3>
                    <button className="modal-button" onClick={closeModal}>Cancel</button>
                </div>

                    <form onSubmit={e => { handleSubmit(e) }} className = 'appt-form'>
                          <Autocomplete suggestions={["Oranges", "Apples", "Banana", "Kiwi", "Mango"]} setFormValue = {setFruit} formValue = {fruit}/>


                    <input className = "submit-bttn" type="submit" value="Submit" disabled = {(showForm)? "disabled" : ""}/>
                    </form>
            </div>
            </div>
      </Modal>

    </div>);

}

export default Empty;  

/*



  
*/