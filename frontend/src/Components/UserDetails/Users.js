import React, { useState, useEffect } from 'react';
import axios from 'axios';
import User from '../User/User';

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
    <div>
      <h1>User details page</h1>
      {users.length > 0 ? (
        users.map((user, i) => (
          <div key={i}>
            <User user={user} />
          </div>
        ))
      ) : (
        <div>No users found.</div>
      )}
    </div>
  );
};

export default Users;