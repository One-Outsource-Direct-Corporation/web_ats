import React from "react";
import "./Login.css";
import oodc from './images/oodc.svg';

const Login: React.FC = () => {
  return (
    <div className="login-container">
  <div className="login-wrapper">
    <div className="login-left">
      <img src={oodc} alt="OODC Logo" className="login-logo" />
      <h1 className="login-title">One Outsource</h1>
      <h2 className="login-subtitle">Applicant Tracking System</h2>
    </div>
    <div className="login-right">
      <form className="login-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  </div>
</div>


  );
};

export default Login;