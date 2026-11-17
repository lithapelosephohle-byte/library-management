import React from "react";
import { Link } from "react-router-dom";

function Navbar({ loggedInUser, logout }) {

  return (
    <nav className="navbar">

      <div className="logo">
        Little Dee Community Library
      </div>

      <div className="nav-links">

        <Link to="/dashboard">
          Dashboard
        </Link>

        <Link to="/books">
          Books
        </Link>

        <Link to="/transactions">
          Transactions
        </Link>

        <Link to="/users">
          Users
        </Link>

        <span className="user-name">
          {loggedInUser.name}
        </span>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;