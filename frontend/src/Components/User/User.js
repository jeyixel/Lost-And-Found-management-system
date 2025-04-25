import React from 'react'
import {Link, useNavigate} from 'react-router-dom';
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
    <div>
      <tr className = 'table-Row-Profile'>
        <td>ID</td>
        <td>{_id}</td>
      </tr>
      <tr className = 'table-Row-Profile'>
        <td>name</td>
        <td>{name}</td>
      </tr>
      
      <tr className = 'table-Row-Profile'>
        <td>Email</td>
        <td>{email}</td>
      </tr>
      
      <tr className = 'table-Row-Profile'>
        <td>Password</td>
        <td>{password}</td>
      </tr>
      <tr className = 'table-Row-Profile'>
        <td>Phone number</td>
        <td>{phoneNumber}</td>
      </tr>
      <tr className = 'table-Row-Profile'>
        <td>Student ID</td>
        <td>{studentID}</td>
      </tr>
      
      <td className='btns'>
        <Link to={`/userdetails/${_id}`} className="update-btn">Update</Link>
        <button onClick={deleteHandler} className="delete-btn">Delete</button>
      </td>
    </div>
    
  );
}

export default User
