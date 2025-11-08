import React from 'react';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2>LinkedIn Clone</h2>
        </div>
        <div className="navbar-user">
          <span className="user-name">Welcome, {user.name}!</span>
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

