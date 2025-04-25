import React from 'react'
import { Link } from 'react-router-dom';
import './nav.css';

function Nav() {
  return (
    <div className="nav-body">
  <header className="nav-header">
    <div className="nav-brandname">
      <Link to="/">FindItFast</Link>
    </div>
    <div className="nav-menu">
      <Link to="/mainhome">Home</Link>
      <Link to="/createAccount">Create Account</Link>
      <Link to="/lostItems">Lost Items</Link>
      <Link to="/foundItems">Found Items</Link>
      <Link to="/feedback">Feedback</Link>
      <Link to="/userdetails">Profile</Link>
    </div>
  </header>
</div>
  )
}

export default Nav
