
import React, { useState } from "react";

function Login({ login }) {

  const [membershipId, setMembershipId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => { 
    e.preventDefault();

    if (membershipId.trim() === "" || password === "") {
      alert("Please enter your membership ID and password.");
      return;
    }

    const success = await login(membershipId, password);

    if (!success) {
      alert("Invalid membership ID or password.");
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>
          Little Dee Community Library
        </h1>

        <h2>Login</h2>

        <form onSubmit={handleSubmit}>

          <label>
            Membership ID
          </label>

          <input
            type="text"
            placeholder="Enter membership ID"
            value={membershipId}
            onChange={(e) => setMembershipId(e.target.value)}
          />

          <label>
            Password
          </label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="primary-btn"
          >
            Login
          </button>

        </form>

        <p className="login-help">
          Default Admin ID: ADMIN001
        </p>

      </div>

    </div>
  );
}

export default Login;
