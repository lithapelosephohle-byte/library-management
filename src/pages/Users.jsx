import React, { useState } from "react";
import UserForm from "../components/UserForm";

function Users({
  users,
  addUser,
  updateUser,
  deleteUser,
  loggedInUser
}) {
  const [editingId, setEditingId] = useState(null);
  const [editUser, setEditUser] = useState({});

  const startEdit = (user) => {
    setEditingId(user.id);
    setEditUser(user);
  };

  const saveUser = () => {
    if (
      editUser.name === "" ||
      editUser.membershipId === ""
    ) {
      alert("Please fill in all fields.");
      return;
    }

    updateUser(editUser);
    setEditingId(null);

    alert("User updated successfully.");
  };

  if (loggedInUser.role !== "Admin") {
    return (
      <div className="page">
        <div className="access-denied">
          <h1>Access Restricted</h1>

          <p>
            Only an Admin can manage users.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>User Management</h1>

      <UserForm addUser={addUser} />

      <div className="table-container">
        <h2>Registered Users</h2>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Membership ID</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>

                {editingId === user.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        value={editUser.name}
                        onChange={(e) =>
                          setEditUser({
                            ...editUser,
                            name: e.target.value
                          })
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="text"
                        value={editUser.membershipId}
                        onChange={(e) =>
                          setEditUser({
                            ...editUser,
                            membershipId:
                              e.target.value
                          })
                        }
                      />
                    </td>

                    <td>
                      <select
                        value={editUser.role}
                        onChange={(e) =>
                          setEditUser({
                            ...editUser,
                            role: e.target.value
                          })
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
                    </td>

                    <td>
                      <button
                        className="save-btn"
                        onClick={saveUser}
                      >
                        Save
                      </button>

                      <button
                        className="cancel-btn"
                        onClick={() =>
                          setEditingId(null)
                        }
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{user.name}</td>

                    <td>
                      {user.membershipId}
                    </td>

                    <td>{user.role}</td>

                    <td>
                      <button
                        className="edit-btn"
                        onClick={() =>
                          startEdit(user)
                        }
                      >
                        Update
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => {
                          if (
                            user.id ===
                            loggedInUser.id
                          ) {
                            alert(
                              "You cannot delete the account you are currently using."
                            );
                            return;
                          }

                          if (
                            window.confirm(
                              "Delete this user?"
                            )
                          ) {
                            deleteUser(user.id);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;