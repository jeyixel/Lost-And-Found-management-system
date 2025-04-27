// import logo from './logo.svg';
import React from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './Components/Home/Home';
import Charity from "./Components/Charity/Charity";
import UserDetails from "./Components/UserDetails/Users";
import CreateUser from "./Components/Adduser/Adduser";
import FoundItems from "./Components/FoundItems/pages/FoundItems";
import AdminFoundItems from "./Components/FoundItems/pages/AdminFoundItems";
import LostItems from "./Components/Lostitems/Lostitems";
import Feedback from "./Components/Feedback/Feedback";
import UpdateUsers from "./Components/UpdateUser/UpdateUsers";
import Login from "./Components/Login/Login";
import Launch from "./Components/LaunchingPage/Launchpage";
import MyReports from './Components/FoundItems/pages/MyReports';
import AdminClaims from './Components/FoundItems/pages/AdminClaims';
import UserClaims from './Components/FoundItems/pages/UserClaims';

// Protected Route component
const ProtectedRoute = ({ children, requireAdmin }) => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const isAuthenticated = !!localStorage.getItem('userId');

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/userdetails" />;
  }

  return children;
};

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
          <Route path="/user-claims" element={<UserClaims />} />
          <Route 
            path="/admin/found-items" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminFoundItems />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/claims" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminClaims />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-reports" 
            element={
              <ProtectedRoute>
                <MyReports />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
