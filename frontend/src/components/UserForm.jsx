
import React, { useState } from "react";

function UserForm({ addUser }) {
  const [name, setName] = useState("");
  const [membershipId, setMembershipId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Member");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      name.trim() === "" ||
      membershipId.trim() === "" ||
      password === ""
    ) {
      alert("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      alert("Password must contain at least 6 characters.");
      return;
    }

    const success = await addUser({
      name: name.trim(),
      membershipId: membershipId.trim(),
      password,
      role
    });

    if (success) {
      setName("");
      setMembershipId("");
      setPassword("");
      setRole("Member");
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>Add New User</h2>

      <label>Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter full name"
      />

      <label>Membership ID</label>
      <input
        type="text"
        value={membershipId}
        onChange={(e) => setMembershipId(e.target.value)}
        placeholder="Enter membership ID"
      />

      <label>Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="At least 6 characters"
      />

      <label>Role</label>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="Member">Member</option>
        <option value="Librarian">Librarian</option>
        <option value="Admin">Admin</option>
      </select>

      <button type="submit" className="primary-btn">
        Add User
      </button>
    </form>
  );
}

export default UserForm;
