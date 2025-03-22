import React from 'react'
import {Link, Navigate, useNavigate} from 'react-router-dom';
import axios from 'axios';
import '../UserDetails/users.css';
//import { useNavigate } from 'react-router-dom';

function User(props) {

  const {_id, name, studentID, email, password, phoneNumber} = props.user

  // data deletion
  const history = useNavigate();

  const deleteHandler = async() => {
    try {
      await axios.delete(`http://localhost:5000/users/${_id}`)
      .then((res) => res.data)
      .then(() => history("/"));
      // window.location.reload(); // refreshes the page to display new data
    } catch (error) {
      console.error(error);
    }
  }

  return (
    
    <tbody className='Users-table-body'>
      <tr>
        <td>ID</td>
        <td>{_id}</td>
      </tr>
      <tr>
        <td>name</td>
        <td>{name}</td>
      </tr>
      
      <tr>
        <td>Email</td>
        <td>{email}</td>
      </tr>
      
      <tr>
        <td>Password</td>
        <td>{password}</td>
      </tr>
      <tr>
        <td>Phone number</td>
        <td>{phoneNumber}</td>
      </tr>
      <tr>
        <td>Student ID</td>
        <td>{studentID}</td>
      </tr>
      
      <td className='btns'>
        <Link to={`/userdetails/${_id}`} className="update-btn">Update</Link>
        <button onClick={deleteHandler} className="delete-btn">Delete</button>
      </td>

    </tbody>
    
  );
}

export default User
