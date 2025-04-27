import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';

function Login() {
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    email: '',
    password: ''
  });

  // Handle input change
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  // send request to the server
  const sendRequest = async () => {
    try {
      console.log('Sending login request with:', {
        email: inputs.email,
        password: inputs.password
      });

      const response = await axios.post("http://localhost:5000/users/login", {
        email: String(inputs.email),
        password: String(inputs.password),
      });

      console.log('Login response:', response.data);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Login failed');
      }

      return response.data;
    } catch (error) {
      console.error('Login request error:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(error.response.data.message || 'Login failed');
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('No response from server. Please try again.');
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error(error.message || 'Login failed');
      }
    }
  }

  // Submit button click
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await sendRequest();
      console.log('Login successful:', response);

      if (response.success) {
        const userData = response.data;
        // Store user data in localStorage
        localStorage.setItem("userId", userData.userId);
        localStorage.setItem("userRole", userData.role);
        localStorage.setItem("isAdmin", userData.isAdmin);
        localStorage.setItem("token", userData.token);
        localStorage.setItem("user", JSON.stringify({
          _id: userData.userId,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          isAdmin: userData.isAdmin
        }));

        // Debug logs
        console.log('Stored data:', {
          userId: localStorage.getItem('userId'),
          role: localStorage.getItem('userRole'),
          isAdmin: localStorage.getItem('isAdmin'),
          token: localStorage.getItem('token'),
          user: JSON.parse(localStorage.getItem('user'))
        });

        // Redirect based on role
        const isAdmin = userData.isAdmin === true || userData.role === 'admin';
        console.log('Is admin?', isAdmin);

        if (isAdmin) {
          console.log('Redirecting to admin dashboard');
          history('/admin/found-items');
        } else {
          console.log('Redirecting to user dashboard');
          history('/userdetails');
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      alert(err.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-body">
      <div className="login-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="email"
              name="email"
              value={inputs.email}
              onChange={handleChange}
              required
            />
            <label className="label">Email</label>
            <div className="underline"></div>
          </div>

          <div className="input-container">
            <input
              type="password"
              name="password"
              value={inputs.password}
              onChange={handleChange}
              required
            />
            <label className="label">Password</label>
            <div className="underline"></div>
          </div>

          <button className='login-btn' type="submit">Login</button>

          <div className='forgot-password'>
            <a href="/forgotpassword">Forgot Password?</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
