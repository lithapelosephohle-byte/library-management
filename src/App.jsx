
import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Transactions from "./pages/Transactions";
import Users from "./pages/Users";

function App() {
  const [books, setBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);

  // Remember the logged-in user
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const savedUser = localStorage.getItem("loggedInUser");

    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      localStorage.removeItem("loggedInUser");
      return null;
    }
  });

  // =====================================
  // LOAD BOOKS FROM MYSQL
  // =====================================

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/books"
        );

        const data = await response.json();

        if (response.ok) {
          setBooks(data);
        }
      } catch (error) {
        console.error("Error loading books:", error);
      }
    };

    fetchBooks();
  }, []);

  // =====================================
  // LOAD TRANSACTIONS FROM MYSQL
  // =====================================

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/transactions"
        );

        const data = await response.json();

        if (response.ok) {
          const formattedTransactions = data.map(
            (transaction) => ({
              id: transaction.id,
              bookTitle: transaction.book_title,
              type:
                transaction.transaction_type === "ADD_STOCK"
                  ? "Add Stock"
                  : "Borrow",
              quantity: transaction.quantity,
              date: new Date(
                transaction.transaction_date
              ).toLocaleString()
            })
          );

          setTransactions(formattedTransactions);
        }
      } catch (error) {
        console.error("Error loading transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  // =====================================
  // LOAD USERS FROM MYSQL
  // =====================================

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/users"
        );

        const data = await response.json();

        if (response.ok) {
          const formattedUsers = data.map((user) => ({
            id: user.id,
            name: user.name,
            membershipId: user.membership_id,
            role: user.role
          }));

          setUsers(formattedUsers);
        }
      } catch (error) {
        console.error("Error loading users:", error);
      }
    };

    fetchUsers();
  }, []);

  // =====================================
  // SAVE LOGGED-IN USER
  // =====================================

  useEffect(() => {
    if (loggedInUser) {
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify(loggedInUser)
      );
    } else {
      localStorage.removeItem("loggedInUser");
    }
  }, [loggedInUser]);

  // =====================================
  // ADD BOOK
  // =====================================

  const addBook = async (book) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/books",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(book)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Could not add book.");
        return;
      }

      setBooks((previousBooks) => [
        { ...book, id: data.id },
        ...previousBooks
      ]);

      alert("Book added successfully.");

    } catch (error) {
      console.error(error);
      alert("Could not connect to the server.");
    }
  };

  // =====================================
  // UPDATE BOOK
  // =====================================

  const updateBook = async (updatedBook) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/books/${updatedBook.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedBook)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Could not update book.");
        return;
      }

      setBooks((previousBooks) =>
        previousBooks.map((book) =>
          book.id === updatedBook.id
            ? updatedBook
            : book
        )
      );

      alert("Book updated successfully.");

    } catch (error) {
      console.error(error);
      alert("Could not connect to the server.");
    }
  };

  // =====================================
  // DELETE BOOK
  // =====================================

  const deleteBook = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/books/${id}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Could not delete book.");
        return;
      }

      setBooks((previousBooks) =>
        previousBooks.filter((book) => book.id !== id)
      );

      alert("Book deleted successfully.");

    } catch (error) {
      console.error(error);
      alert("Could not connect to the server.");
    }
  };

  // =====================================
  // ADD STOCK OR BORROW BOOK
  // =====================================

  const changeStock = async (bookId, amount, type) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/transactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            book_id: bookId,
            type: type,
            quantity: Math.abs(Number(amount))
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Transaction failed.");
        return false;
      }

      setBooks((previousBooks) =>
        previousBooks.map((book) =>
          book.id === bookId
            ? { ...book, quantity: data.newQuantity }
            : book
        )
      );

      setTransactions((previousTransactions) => [
        {
          id: data.id,
          bookTitle: data.bookTitle,
          type: data.type,
          quantity: data.quantity,
          date: new Date().toLocaleString()
        },
        ...previousTransactions
      ]);

      return true;

    } catch (error) {
      console.error("Transaction error:", error);
      alert("Could not connect to the server.");
      return false;
    }
  };

  // =====================================
  // ADD USER TO MYSQL
  // =====================================

  const addUser = async (newUser) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newUser)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Could not add user.");
        return false;
      }

      const addedUser = {
        id: data.id,
        name: newUser.name,
        membershipId: newUser.membershipId,
        role: newUser.role
      };

      setUsers((previousUsers) => [
        addedUser,
        ...previousUsers
      ]);

      alert("User added successfully.");
      return true;

    } catch (error) {
      console.error("Add user error:", error);
      alert("Could not connect to the server.");
      return false;
    }
  };

  // =====================================
  // UPDATE USER IN MYSQL
  // =====================================

  const updateUser = async (updatedUser) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${updatedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: updatedUser.name,
            membershipId: updatedUser.membershipId,
            role: updatedUser.role
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Could not update user.");
        return false;
      }

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user.id === updatedUser.id
            ? updatedUser
            : user
        )
      );

      return true;

    } catch (error) {
      console.error("Update user error:", error);
      alert("Could not connect to the server.");
      return false;
    }
  };

  // =====================================
  // DELETE USER FROM MYSQL
  // =====================================

  const deleteUser = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${id}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Could not delete user.");
        return false;
      }

      setUsers((previousUsers) =>
        previousUsers.filter((user) => user.id !== id)
      );

      alert("User deleted successfully.");
      return true;

    } catch (error) {
      console.error("Delete user error:", error);
      alert("Could not connect to the server.");
      return false;
    }
  };

  // =====================================
  // LOGIN USING MYSQL
  // =====================================

  const login = async (membershipId, password) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            membershipId: membershipId,
            password: password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return false;
      }

      setLoggedInUser(data.user);

      return true;

    } catch (error) {
      console.error("Login error:", error);
      alert("Could not connect to the server.");
      return false;
    }
  };

  // =====================================
  // LOGOUT
  // =====================================

  const logout = () => {
    setLoggedInUser(null);
  };

  // =====================================
  // APPLICATION ROUTES
  // =====================================

  return (
    <>
      {loggedInUser && (
        <Navbar
          loggedInUser={loggedInUser}
          logout={logout}
        />
      )}

      <Routes>

        {/* HOME PAGE */}
        <Route
          path="/"
          element={
            loggedInUser
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/login" replace />
          }
        />

        {/* LOGIN PAGE */}
        <Route
          path="/login"
          element={
            loggedInUser
              ? <Navigate to="/dashboard" replace />
              : <Login login={login} />
          }
        />

        {/* DASHBOARD PAGE */}
        <Route
          path="/dashboard"
          element={
            loggedInUser
              ? <Dashboard books={books} />
              : <Navigate to="/login" replace />
          }
        />

        {/* BOOK MANAGEMENT PAGE */}
        <Route
          path="/books"
          element={
            loggedInUser ? (
              <Books
                books={books}
                addBook={addBook}
                updateBook={updateBook}
                deleteBook={deleteBook}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* TRANSACTIONS PAGE */}
        <Route
          path="/transactions"
          element={
            loggedInUser ? (
              <Transactions
                books={books}
                transactions={transactions}
                changeStock={changeStock}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* ADMIN-ONLY USER MANAGEMENT PAGE */}
        <Route
          path="/users"
          element={
            loggedInUser && loggedInUser.role === "Admin" ? (
              <Users
                users={users}
                addUser={addUser}
                updateUser={updateUser}
                deleteUser={deleteUser}
                loggedInUser={loggedInUser}
              />
            ) : (
              <Navigate
                to={loggedInUser ? "/dashboard" : "/login"}
                replace
              />
            )
          }
        />

        {/* UNKNOWN PAGE */}
        <Route
          path="*"
          element={
            <Navigate
              to={loggedInUser ? "/dashboard" : "/login"}
              replace
            />
          }
        />

      </Routes>
    </>
  );
}

export default App;
