import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {useParams} from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import styles from "./updateuser.module.css";

function UpdateUsers() {

    const [inputs, setInputs] = useState({});

    const history = useNavigate();
    const id = useParams().id; // /userdetails/:id from App.js, both id should be same

    useEffect(() => {
        const fetchHandler = async () => {
            await axios.get(`http://localhost:5000/users/${id}`).then((res) => res.data).then((data) => setInputs(data.user));
        };
        fetchHandler();
    }, [id]);

    const sendRequest = async () => {
        await axios.put(`http://localhost:5000/users/${id}`, {
            name: String (inputs.name),
            studentID: String (inputs.studentID),
            email: String (inputs.email),
            password: String (inputs.password),
            phoneNumber: Number (inputs.phoneNumber),
        })
        .then((res) => res.data);
    }

    // handle input change
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // submit button click
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputs);
    sendRequest().then(() => history('/userdetails')); // add the route path in App.js here to redirect to the desired page
  }

  return (
    <div className={styles['form-body']}>
        
        <section className={styles.container}>
          <header className={styles.headerclass}>Update details</header>
          <form className={styles['form-class']} onSubmit={handleSubmit}>
    
            <div className={styles['input-box']}>
              <label>Name</label>
              <input type='text' name='name' onChange={handleChange} value={inputs.name} placeholder='Enter full name' className={styles['input-element']} required/>
            </div>
    
            <div className={styles['input-box']}>
              <label>Student ID</label>
              <input type='text' name='studentID' onChange={handleChange} value={inputs.studentID} placeholder='Student ID' className={styles['input-element']} required/>
            </div>
    
            <div className={styles['input-box']}>
              <label>Email</label>
              <input type='text' name='email' onChange={handleChange} value={inputs.email} placeholder='someone@gmail.com' className={styles['input-element']} required/>
            </div>
    
            <div className={styles['input-box']}>
              <label>Password</label>
              <input type='password' name='password' onChange={handleChange} value={inputs.password} placeholder='password' className={styles['input-element']} required/>
            </div>
    
            <div className={styles['input-box']}>
              <label>Phone number</label>
              <input type='number' name='phoneNumber' onChange={handleChange} value={inputs.phoneNumber} placeholder='Enter phone number' className={styles['input-element']} required/>
            </div>
    
            <div className={styles['submit-container']}>
              <button className={styles['submit-button']}>Submit</button>
            </div>
          </form>
        </section>
      </div>
  )
}

export default UpdateUsers
