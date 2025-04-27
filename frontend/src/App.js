// import logo from './logo.svg';
import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './Components/Home/Home';
// import Nav from "./Components/Navbar/Nav";
import Charity from "./Components/Charity/Charity";
import UserDetails from "./Components/UserDetails/Users";
import CreateUser from "./Components/Adduser/Adduser";
import FoundItems from "./Components/FoundItems/pages/FoundItems";
import LostItems from "./Components/Lostitems/Lostitems";
import Feedback from "./Components/Feedback/Feedback";
import UpdateUsers from "./Components/UpdateUser/UpdateUsers";
import Login from "./Components/Login/Login";
import Launch from "./Components/LaunchingPage/Launchpage";
import AdminLogin from './Components/Login/AdminLogin';
import AdminDashboard from './Components/AdminDashboard/AdminDashboard';
import Recovery from './Components/forgotpassword/Forgotpass';
import MyReports from './Components/FoundItems/pages/MyReports';

function App() {
  return (
    <div>
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
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/forgotpassword" element={<Recovery />} />
          <Route path="/my-reports" element={<MyReports />} />
          <Route path="/found-items/my-reports" element={<MyReports />} />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
