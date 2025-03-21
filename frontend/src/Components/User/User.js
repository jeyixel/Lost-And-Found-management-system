import React from 'react'
import {Link} from 'react-router-dom';
import axios from 'axios';
//import { useNavigate } from 'react-router-dom';

function User(props) {

  const {_id, name, studentID, email, password, phoneNumber} = props.user

  // data deletion
  //const history = useNavigate();

  const deleteHandler = async() => {
    try {
      await axios.delete(`http://localhost:5000/users/${_id}`)
      .then((res) => res.data)
      // .then(() => history("/"))
      // .then(() => history("/userdetails"));
      window.location.reload(); // refreshes the page to display new data
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <h1>User display page</h1>
      <br></br>
      <h1>ID: {_id}</h1>
      <h1>ID: {studentID}</h1>
      <h1>Name: {name}</h1>
      <h1>Email: {email}</h1>
      <h1>Password: {password}</h1>
      <h1>Phone number: {phoneNumber}</h1>
      <Link to={`/userdetails/${_id}`}>Update</Link>
      <button onClick={deleteHandler}>Delete</button>
    </div>
  )
}

export default User
