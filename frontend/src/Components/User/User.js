import React from 'react'

function User(props) {

  if(!props.user) {
    return <h1>No data found</h1>
  }

  const {_id, name, studentID, email, password, phoneNumber} = props.user
  return (
    <div>
      <h1>User display page</h1>
      <br></br>
      <h1>ID: {_id}</h1>
      <h1>ID: {studentID}</h1>
      <h1>Name: {name}</h1>
      <h1>Email: {email}</h1>
      <h1>Password: {password}</h1>
      <h1>Phone number: {phoneNumber}</h1>
      
    </div>
  )
}

export default User
