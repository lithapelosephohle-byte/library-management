import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Transactions from "./pages/Transactions";
import Users from "./pages/Users";

function App() {

  const [books, setBooks] = useState(() => {
    const savedBooks = localStorage.getItem("books");

    if (savedBooks) {
      return JSON.parse(savedBooks);
    }

    return [
      {
        id: 1,
        title: "Angry Birds",
        author: "Peter Vesterbacka",
        genre: "Children",
        isbn: "1111111111",
        quantity: 3
      },
      {
        id: 2,
        title: "Things Fall Apart",
        author: "Chinua Achebe",
        genre: "Novel",
        isbn: "2222222222",
        quantity: 1
      }
    ];
  });

  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("users");

    if (savedUsers) {
      return JSON.parse(savedUsers);
    }

    return [
      {
        id: 1,
        name: "Library Admin",
        membershipId: "ADMIN001",
        role: "Admin"
      }
    ];
  });

  const [transactions, setTransactions] = useState(() => {
    const savedTransactions =
      localStorage.getItem("transactions");

    if (savedTransactions) {
      return JSON.parse(savedTransactions);
    }

    return [];
  });

  const [loggedInUser, setLoggedInUser] = useState(() => {
    const savedUser =
      localStorage.getItem("loggedInUser");

    if (savedUser) {
      return JSON.parse(savedUser);
    }

    return null;
  });

  useEffect(() => {
    localStorage.setItem(
      "books",
      JSON.stringify(books)
    );
  }, [books]);

  useEffect(() => {
    localStorage.setItem(
      "users",
      JSON.stringify(users)
    );
  }, [users]);

  useEffect(() => {
    localStorage.setItem(
      "transactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

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

  const addBook = (book) => {
    const newBook = {
      id: Date.now(),
      title: book.title,
      author: book.author,
      genre: book.genre,
      isbn: book.isbn,
      quantity: Number(book.quantity)
    };

    setBooks([
      ...books,
      newBook
    ]);
  };

  const updateBook = (updatedBook) => {
    setBooks(
      books.map((book) => {
        if (book.id === updatedBook.id) {
          return {
            ...updatedBook,
            quantity: Number(
              updatedBook.quantity
            )
          };
        }

        return book;
      })
    );
  };

  const deleteBook = (id) => {
    setBooks(
      books.filter(
        (book) => book.id !== id
      )
    );
  };

  const addUser = (user) => {
    const newUser = {
      id: Date.now(),
      name: user.name,
      membershipId: user.membershipId,
      role: user.role
    };

    setUsers([
      ...users,
      newUser
    ]);
  };

  const updateUser = (updatedUser) => {
    setUsers(
      users.map((user) => {
        if (user.id === updatedUser.id) {
          return updatedUser;
        }

        return user;
      })
    );
  };

  const deleteUser = (id) => {
    setUsers(
      users.filter(
        (user) => user.id !== id
      )
    );
  };

  const login = (membershipId) => {
    const user = users.find(
      (user) =>
        user.membershipId.toLowerCase() ===
        membershipId.toLowerCase()
    );

    if (user) {
      setLoggedInUser(user);
      return true;
    }

    return false;
  };

  const logout = () => {
    setLoggedInUser(null);
  };

  const changeStock = (
    bookId,
    amount,
    type
  ) => {
    const book = books.find(
      (book) => book.id === bookId
    );

    if (!book) {
      return false;
    }

    if (
      type === "Borrow" &&
      book.quantity <= 0
    ) {
      return false;
    }

    if (
      type === "Borrow" &&
      book.quantity + amount < 0
    ) {
      return false;
    }

    setBooks(
      books.map((book) => {
        if (book.id === bookId) {
          return {
            ...book,
            quantity:
              book.quantity + amount
          };
        }

        return book;
      })
    );

    const newTransaction = {
      id: Date.now(),
      bookTitle: book.title,
      type: type,
      quantity: Math.abs(amount),
      date: new Date().toLocaleString()
    };

    setTransactions([
      newTransaction,
      ...transactions
    ]);

    return true;
  };

  return (
    <>
      {loggedInUser && (
        <Navbar
          loggedInUser={loggedInUser}
          logout={logout}
        />
      )}

      <Routes>

        <Route
          path="/"
          element={
            loggedInUser ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/login"
          element={
            loggedInUser ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login login={login} />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            loggedInUser ? (
              <Dashboard books={books} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

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
              <Navigate to="/login" />
            )
          }
        />

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
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/users"
          element={
            loggedInUser ? (
              <Users
                users={users}
                addUser={addUser}
                updateUser={updateUser}
                deleteUser={deleteUser}
                loggedInUser={loggedInUser}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

      </Routes>
    </>
  );
}

export default App;