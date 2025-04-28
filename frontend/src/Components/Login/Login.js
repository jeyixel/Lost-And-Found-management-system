import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';
import { Link } from 'react-router-dom';

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

  // Submit button click
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email: inputs.email,
        password: inputs.password,
      }).then(res => res.data);

      if (response.status === "ok") {
        // 1) store ID + role
        localStorage.setItem("userId", response.userId);
        localStorage.setItem("role", response.role);

        // 2) branch to admin vs student
        if (response.role === "admin") {
          alert("Admin login successful");
          history("/admin/dashboard");
        } else {
          alert("Login successful");
          history("/mainhome");
        }
      } else {
        alert("Login failed: " + response.err);
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
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
            {/* <a href="/forgotpassword">Forgot Password?</a> */}
            <Link to="/forgotpassword">Forgot Password?</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
