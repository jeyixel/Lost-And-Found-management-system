import React from 'react';
import "./adminpage.css";
import { Link } from 'react-router-dom';

function AdminDashboard() {
  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <div className="admin-logo">
          <h2 className="admin-logo-text">Admin Panel</h2>
        </div>
        <div className="admin-nav">
          <ul className="admin-nav-list">
            <li className="admin-nav-item active">
              <span className="admin-nav-icon">📊</span>
              <span className="admin-nav-text">Dashboard</span>
            </li>
            <li className="admin-nav-item">
              <span className="admin-nav-icon">👤</span>
              <span className="admin-nav-text">User Management</span>
            </li>
            <li className="admin-nav-item">
              <span className="admin-nav-icon">⚙️</span>
              <span className="admin-nav-text">Settings</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="admin-main">
        <div className="admin-header">
          <div className="admin-title">
            <h1 className="admin-heading">Admin Dashboard</h1>
          </div>
          <div className="admin-profile">
            <span className="admin-username">Admin User</span>
            <div className="admin-avatar">👤</div>
            <div className="admin-dropdown">
              <div className="admin-dropdown-content">
                <button className="admin-dropdown-item">
                  <span className="admin-dropdown-icon">🚪</span>
                  <span className="admin-dropdown-text"><Link to = "/">Sign Out</Link></span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="admin-content">
          <div className="admin-summary">
            <div className="admin-summary-card">
              <div className="admin-summary-icon">📦</div>
              <div className="admin-summary-info">
                <span className="admin-summary-number">124</span>
                <span className="admin-summary-text">Total Items</span>
              </div>
            </div>
            <div className="admin-summary-card">
              <div className="admin-summary-icon">🔍</div>
              <div className="admin-summary-info">
                <span className="admin-summary-number">45</span>
                <span className="admin-summary-text">Lost Items</span>
              </div>
            </div>
            <div className="admin-summary-card">
              <div className="admin-summary-icon">✅</div>
              <div className="admin-summary-info">
                <span className="admin-summary-number">79</span>
                <span className="admin-summary-text"><Link to="/foundItems">Found Items</Link></span>
              </div>
            </div>
            <div className="admin-summary-card">
              <div className="admin-summary-icon">💰</div>
              <div className="admin-summary-info">
                <span className="admin-summary-number">32</span>
                <span className="admin-summary-text">Donations</span>
              </div>
            </div>
          </div>
          
          <div className="admin-actions">
            <div className="admin-section-header">
              <h2 className="admin-section-title">Quick Actions</h2>
            </div>
            <div className="admin-buttons">
              <button className="admin-button admin-button-found">
                <span className="admin-button-icon">✅</span>
                <span className="admin-button-text"><Link to="/foundItems">View Found Items</Link></span>
              </button>
              <button className="admin-button admin-button-lost">
                <span className="admin-button-icon">🔍</span>
                <span className="admin-button-text">View Lost Items</span>
              </button>
              <button className="admin-button admin-button-donations">
                <span className="admin-button-icon">💰</span>
                <span className="admin-button-text">Donations</span>
              </button>
              <button className="admin-button admin-button-inventory">
                <span className="admin-button-icon">📦</span>
                <span className="admin-button-text">Inventory Management</span>
              </button>
            </div>
          </div>
          
          <div className="admin-recent">
            <div className="admin-section-header">
              <h2 className="admin-section-title">Recent Activity</h2>
            </div>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead className="admin-table-header">
                  <tr className="admin-table-row">
                    <th className="admin-table-heading">Item</th>
                    <th className="admin-table-heading">Status</th>
                    <th className="admin-table-heading">Date</th>
                    <th className="admin-table-heading">Action</th>
                  </tr>
                </thead>
                <tbody className="admin-table-body">
                  <tr className="admin-table-row">
                    <td className="admin-table-cell">Blue Backpack</td>
                    <td className="admin-table-cell"><span className="admin-status admin-status-found">Found</span></td>
                    <td className="admin-table-cell">Apr 24, 2025</td>
                    <td className="admin-table-cell"><button className="admin-table-button">View</button></td>
                  </tr>
                  <tr className="admin-table-row">
                    <td className="admin-table-cell">iPhone 16</td>
                    <td className="admin-table-cell"><span className="admin-status admin-status-lost">Lost</span></td>
                    <td className="admin-table-cell">Apr 23, 2025</td>
                    <td className="admin-table-cell"><button className="admin-table-button">View</button></td>
                  </tr>
                  <tr className="admin-table-row">
                    <td className="admin-table-cell">Textbooks (x3)</td>
                    <td className="admin-table-cell"><span className="admin-status admin-status-donation">Donation</span></td>
                    <td className="admin-table-cell">Apr 22, 2025</td>
                    <td className="admin-table-cell"><button className="admin-table-button">View</button></td>
                  </tr>
                  <tr className="admin-table-row">
                    <td className="admin-table-cell">Water Bottle</td>
                    <td className="admin-table-cell"><span className="admin-status admin-status-found">Found</span></td>
                    <td className="admin-table-cell">Apr 21, 2025</td>
                    <td className="admin-table-cell"><button className="admin-table-button">View</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;