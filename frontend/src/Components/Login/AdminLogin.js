import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [inputs, setInputs] = useState({ email: '', password: '' });
  const history = useNavigate();

  const sendRequest = () =>
    axios.post("http://localhost:5000/admin/login", {
      email: inputs.email,
      password: inputs.password
    }).then(res => res.data);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await sendRequest();
      if (response.status === "ok") {
        localStorage.setItem("adminId", response.userId);
        alert("Admin login successful");
        history("/admin/dashboard"); // Redirect to admin dashboard
      } else {
        alert("Login failed: " + response.err);
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Admin Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={inputs.email}
        onChange={e => setInputs({ ...inputs, email: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={inputs.password}
        onChange={e => setInputs({ ...inputs, password: e.target.value })}
        required
      />
      <button type="submit">Login as Admin</button>
    </form>
  );
}