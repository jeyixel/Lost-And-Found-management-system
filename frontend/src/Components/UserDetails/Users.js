import React, { useState, useEffect } from 'react';
import axios from 'axios';
import User from '../User/User';
import './users.css';
import Nav from '../Navbar/Nav';

const Users = () => {
  const URL = "http://localhost:5000/users";
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getStudents = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/users/${userId}`);
        console.log(res.data.user);
        setUsers([res.data.user]);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    getStudents();
  }, []);

  if (loading) {
    return <div className="loading-container"><div className="loading-spinner"></div></div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className='users-container'>
      <Nav/>
      <div className="profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
        </div>
        <div className="profile-card">
          {users.map((user) => (
            <User key={user._id} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Users;