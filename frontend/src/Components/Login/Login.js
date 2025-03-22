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
    return await axios.post("http://localhost:5000/login",{
      email: String (inputs.email),
      password: String (inputs.password),
    }).then(res => res.data);
  }

  // Submit button click
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const response = await sendRequest();
      if (response.status === "ok"){
        alert("Login successful");
        localStorage.setItem("userId", response.userId);
        history('/userdetails');
      }else{
        alert("Login failed");
      }
    }catch(err){
      console.error("Error" + err.message);
    }
  };

  return (
    <div className="login-body">
      <div className="login-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="login-input-boxes">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={inputs.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="login-input-boxes">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={inputs.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
