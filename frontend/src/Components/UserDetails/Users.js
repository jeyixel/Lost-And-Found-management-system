import React, { useState, useEffect } from 'react';
import axios from 'axios';
import User from '../User/User';
import './users.css';

const Users = () => {
  const URL = "http://localhost:5000/users";
  const [users, setUsers] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getStudents = async () => {
      try {
        const res = await axios.get(URL);
        console.log("API Response:", res.data);

        // Access the Users array from the response
        setUsers(res.data.Users);
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
      <h1>Users List</h1>
      <table className='Users-table'>
        {users.map((user) => (
          <User key={user._id} user={user} />
        ))}
      </table>
    </div>
  );
};

export default Users;