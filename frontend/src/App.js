// import logo from './logo.svg';
import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './Components/Home/Home';
import Nav from "./Components/Navbar/Nav";
import Charity from "./Components/Charity/Charity";
import UserDetails from "./Components/UserDetails/Users";
import CreateUser from "./Components/CreateAccount/addUser";
import FoundItems from "./Components/FoundItems/FoundItems";
import LostItems from "./Components/Lostitems/Lostitems";
import Feedback from "./Components/Feedback/Feedback";

function App() {
  return (
    <div>
      <Nav/>
      <React.Fragment>
        <Routes>
          <Route path="/mainhome" element={<Home />} />
          <Route path="/userdetails" element={<UserDetails />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/createAccount" element={<CreateUser />} />
          <Route path="/lostItems" element={<LostItems />} />
          <Route path="/foundItems" element={<FoundItems />} />
          <Route path="/charity" element={<Charity />} />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
