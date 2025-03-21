import React from 'react'
import { Link } from 'react-router-dom';

function Launchpage() {
  return (
    <div>
      <h1>Welcome to FindItFast</h1>
      <p>A very own lost and found management system for students of sliit</p>

      <Link to="/login">login</Link>
      <Link to="/createAccount">Create Account</Link>
    </div>
  )
}

export default Launchpage