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
          <div class="input-container">
              <input 
                  type="email"
                  name="email"
                  value={inputs.email}
                  onChange={handleChange}
                  required
              />
              <label class="label">Email</label>
              <div class="underline"></div>
          </div>

          <div class="input-container">
              <input 
                  type="password"
                  name="password"
                  value={inputs.password}
                  onChange={handleChange}
                  required
              />
              <label class="label">Password</label>
              <div class="underline"></div>
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
