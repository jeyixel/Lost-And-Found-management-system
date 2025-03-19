import React from 'react'
import { Link } from 'react-router-dom';
import './nav.css';

function Nav() {
  return (
    <div>
      <header>

        <div className="brandname">
            <Link to="/">FindItFast</Link>
        </div>

        <div className = "menu">
            <div className = "btn">
                <i className = "fas fa-times close-btn"></i>
            </div>
            <Link to = "/mainhome">Home</Link>
            <Link to = "/createAccount">Create Account</Link>
            <Link to = "/lostItems">Lost Items</Link>
            <Link to = "/foundItems">Found Items</Link>
            <Link to = "/feedback">Feedback</Link>
            <Link to = "/userdetails">Profile</Link>
        </div>

      </header>
    </div>
  )
}

export default Nav
