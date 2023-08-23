import React, { useState } from 'react';
import './Contact.css'


function Contact(props) {
  const [name, setName] = useState('');
  const [email, setEmailId] = useState('');
  const [phone, setphoneNumber] = useState('');

  function submitHandler(event) {
    event.preventDefault();



    const Detail = {
      name: name,
     emailID: email,
      phoneNumber: phone,
    };

    props.onAddDetail(Detail);

    // Reset form fields
    setName('');
    setEmailId('');
    setphoneNumber('');
  }

  return (
    <form onSubmit={submitHandler}>
      <div >
        <label htmlFor='title' className='control'>Name</label>
        <input
          type='text'
          id='name'
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      <div >
        <label htmlFor='opening-text' className='control'>Email Id</label>
        <input
         type='email'
          id='email'
          value={email}
          onChange={(event) => setEmailId(event.target.value)}
        ></input>
      </div>
      <div >
        <label htmlFor='date' className='control'>Phone Number</label>
        <input
          type='number'
          id='no'
          value={phone}
          onChange={(event) => setphoneNumber(event.target.value)}
        />
      </div>
      <button>Submit</button>
    </form>
  );
}

export default Contact;