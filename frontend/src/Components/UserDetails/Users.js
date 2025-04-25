import React, { useState, useEffect } from 'react';
import axios from 'axios';
import User from '../User/User';
import './users.css';
import Nav from '../Navbar/Nav';

const Users = () => {
  const URL = "http://localhost:5000/users";
  const [users, setUsers] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getStudents = async () => {
      const userId = localStorage.getItem("userId"); // Retrieve the user ID from localStorage
      if (!userId) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/users/${userId}`);
        console.log(res.data.user);
        setUsers(res.data.user); // Set the user details
        setUsers([res.data.user])
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    getStudents();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='Users-body'>
      <Nav/>
      <h1 className='header-profile'>My profile</h1>
      <table className='Users-table'>
        <tbody className='Users-table-body'>
          {users.map((user) => (
            <User key={user._id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;