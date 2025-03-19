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
            <Link to = "/">Home</Link>
            <Link to = "/">Lost Items</Link>
            <Link to = "/">Found Items</Link>
            <Link to = "/">Feedback</Link>
            <Link to = "/">Contact</Link>
        </div>

      </header>
    </div>
  )
}

export default Nav
