import React from "react";

function Dashboard({ books }) {
  const totalBooks = books.length;

  const totalCopies = books.reduce(
    (total, book) => {
      return total + Number(book.quantity);
    },
    0
  );

  const lowStockBooks = books.filter(
    (book) => book.quantity < 2
  );

  return (
    <div className="page">
      <h1>Library Dashboard</h1>

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
            {books.map((book) => (
              <tr
                key={book.id}
                className={
                  book.quantity < 2
                    ? "low-stock"
                    : ""
                }
              >
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>{book.quantity}</td>
                <td>
                  {book.quantity < 2
                    ? "Low Stock"
                    : "Available"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Dashboard;