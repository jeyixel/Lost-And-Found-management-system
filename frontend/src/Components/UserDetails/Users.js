import React, {useState, useEffect} from 'react'
import axios from 'axios';

const URL = "http://localhost:5000/users"

const fetchHandler = async () => {
    return await axios.get(URL).then((res) => res.data);
}

function Users() {

    const[users, setUsers] = useState();
    useEffect(() => {
        fetchHandler().then((data) => setUsers(data.users));
    }, []);
    
  return (
    <div>
      
    </div>
  )
}

export default Users
