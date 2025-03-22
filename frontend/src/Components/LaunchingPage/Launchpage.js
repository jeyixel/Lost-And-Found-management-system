import React from 'react'
import { Link } from 'react-router-dom';
import './launch.css';

function Launchpage() {
  return (
    <div className='launch-body'>
      <div className="welcome">
        <h1>Welcome to FindItFast</h1>
      </div>

      <div className="para">
        <p>A very own lost and found management system for students of sliit</p>
      </div>

      <div className="buttondeka">

        <div className="button1">
          <button className="button1-class">
            <Link className='launchlink' to="/login">login</Link>
          </button>
        </div>

        <div classNameName="button2">
          <button className='button2-class'>
            <Link className='launchlink' to="/createAccount">Create Account</Link>
          </button>
        </div>

      </div>
    </div>
  )
}

export default Launchpage