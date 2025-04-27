import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../UserDetails/users.css';

function User(props) {
  const { _id, name, studentID, email, password, phoneNumber } = props.user;
  const navigate = useNavigate();

  const deleteHandler = async() => {
    try {
      await axios.delete(`http://localhost:5000/users/${_id}`)
        .then((res) => res.data)
        .then(() => navigate("/"));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="user-details">
      <div className="profile-info">
        {/* <div className="info-row">
          <div className="info-label">ID</div>
          <div className="info-value">{_id}</div>
        </div> */}
        <div className="info-row">
          <div className="info-label">Name</div>
          <div className="info-value">{name}</div>
        </div>
        <div className="info-row">
          <div className="info-label">Email</div>
          <div className="info-value">{email}</div>
        </div>
        <div className="info-row">
          <div className="info-label">Password</div>
          <div className="info-value">{password}</div>
        </div>
        <div className="info-row">
          <div className="info-label">Phone Number</div>
          <div className="info-value">{phoneNumber}</div>
        </div>
        <div className="info-row">
          <div className="info-label">Student ID</div>
          <div className="info-value">{studentID}</div>
        </div>
      </div>
      <div className="action-buttons">

        <div className="logoutbtncontainer">
          <Link to={'/'} className="logout-btn">Log out</Link>
        </div>


        <div className="buttondivide">
          <Link to={`/userdetails/${_id}`} className="update-btn">Update</Link>
          <button onClick={deleteHandler} className="delete-btn">Delete</button>
        </div>
      </div>
    </div>
  );
}

export default User;