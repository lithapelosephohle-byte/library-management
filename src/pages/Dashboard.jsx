
import React from "react";

function Dashboard({ books }) {
  const totalBooks = books.length;

  const totalCopies = books.reduce(
    (total, book) => total + Number(book.quantity),
    0
  );

  const lowStockBooks = books.filter(
    (book) => Number(book.quantity) < 2
  );

  return (
    <div className="page">
      <h1>Library Dashboard</h1>

      {/* Dashboard Statistics */}
      <div className="dashboard-cards">

        <div className="dashboard-card">
          <h3>Total Books</h3>
          <p>{totalBooks}</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Copies</h3>
          <p>{totalCopies}</p>
        </div>

        <div className="dashboard-card">
          <h3>Low Stock</h3>
          <p>{lowStockBooks.length}</p>
        </div>

      </div>

      {/* Book Availability */}
      <div className="table-container">
        <h2>Current Book Availability</h2>

        <table>
          <thead>
            <tr>
              <th>Book</th>
              <th>Author</th>
              <th>Genre</th>
              <th>Available Copies</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {books.length === 0 ? (
              <tr>
                <td colSpan="5">
                  No books have been registered yet.
                </td>
              </tr>
            ) : (
              books.map((book) => {
                const quantity = Number(book.quantity);

                return (
                  <tr
                    key={book.id}
                    className={quantity < 2 ? "low-stock" : ""}
                  >
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.genre}</td>
                    <td>{quantity}</td>
                    <td>
                      {quantity === 0
                        ? "Out of Stock"
                        : quantity < 2
                        ? "Low Stock"
                        : "Available"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Low Stock Details */}
      <div className="table-container">
        <h2>Low Stock Alerts</h2>

        {lowStockBooks.length === 0 ? (
          <p>There are currently no low-stock books.</p>
        ) : (
          <ul>
            {lowStockBooks.map((book) => (
              <li key={book.id}>
                {book.title} — {Number(book.quantity)} copies remaining
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}

export default Dashboard;
