// import logo from './logo.svg';
import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './Components/Home/Home';
import Nav from "./Components/Navbar/Nav";
import Charity from "./Components/Charity/Charity";
import UserDetails from "./Components/UserDetails/Users";
import CreateUser from "./Components/Adduser/Adduser";
import FoundItems from "./Components/FoundItems/FoundItems";
import LostItems from "./Components/Lostitems/Lostitems";
import Feedback from "./Components/Feedback/Feedback";
import UpdateUsers from "./Components/UpdateUser/UpdateUsers";
import Login from "./Components/Login/Login";
import Launch from "./Components/LaunchingPage/Launchpage";

function App() {
  return (
    <div>
      <Nav/>
      <React.Fragment>
        <Routes>
          <Route path="/" element={<Launch />} />
          <Route path="/mainhome" element={<Home />} />
          <Route path="/userdetails" element={<UserDetails />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/createAccount" element={<CreateUser />} />
          <Route path="/login" element={<Login />} />
          <Route path="/lostItems" element={<LostItems />} />
          <Route path="/foundItems" element={<FoundItems />} />
          <Route path="/charity" element={<Charity />} />
          <Route path="/userdetails/:id" element={<UpdateUsers />} />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
