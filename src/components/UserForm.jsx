import React, { useState } from "react";

function UserForm({ addUser }) {

  const [name, setName] = useState("");
  const [membershipId, setMembershipId] = useState("");
  const [role, setRole] = useState("Member");

  const handleSubmit = (e) => {

    e.preventDefault();

    if (name === "" || membershipId === "") {
      alert("Please fill in all fields.");
      return;
    }

    addUser({
      name: name,
      membershipId: membershipId,
      role: role
    });

    setName("");
    setMembershipId("");
    setRole("Member");

    alert("User added successfully.");
  };

  return (
    <form
      className="form-card"
      onSubmit={handleSubmit}
    >

      <h2>Add New User</h2>

      <label>Name</label>

      <input
        type="text"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <label>Membership ID</label>

      <input
        type="text"
        value={membershipId}
        onChange={(e) =>
          setMembershipId(e.target.value)
        }
      />

      <label>Role</label>

      <select
        value={role}
        onChange={(e) =>
          setRole(e.target.value)
        }
      >
        <option value="Member">
          Member
        </option>

        <option value="Librarian">
          Librarian
        </option>

        <option value="Admin">
          Admin
        </option>
      </select>

      <button
        type="submit"
        className="primary-btn"
      >
        Add User
      </button>

    </form>
  );
}

export default UserForm;