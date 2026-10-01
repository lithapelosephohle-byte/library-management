import React, { useState } from "react";

function Login({ login }) {

  const [membershipId, setMembershipId] =
    useState("");

  const handleSubmit = (e) => {

    e.preventDefault();

    if (membershipId === "") {
      alert("Please enter your membership ID.");
      return;
    }

    const success = login(membershipId);

    if (!success) {
      alert(
        "User not found. Please check your membership ID."
      );
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
            onChange={(e) =>
              setMembershipId(e.target.value)
            }
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