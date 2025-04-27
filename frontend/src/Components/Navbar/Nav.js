import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './nav.css';

function Nav() {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  return (
    <div className="nav-body">
      <header className="nav-header">
        <div className="nav-brandname">
          <Link to="/">FindItFast</Link>
        </div>
        <div className="nav-menu">
          <Link to="/mainhome">Home</Link>
          {!isAdmin && <Link to="/createAccount">Create Account</Link>}
          <Link to="/lostItems">Lost Items</Link>
          {isAdmin ? (
            <>
              <Link to="/admin/found-items">Found Items</Link>
              <Link to="/admin/found-items">Profile</Link>
            </>
          ) : (
            <>
              <Link to="/foundItems">Found Items</Link>
              <Link to="/userdetails">Profile</Link>
            </>
          )}
          <Link to="/feedback">Feedback</Link>
        </div>
      </header>
    </div>
  )
}

export default Nav
