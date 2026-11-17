import React, { useState } from "react";

function Transactions({
  books,
  transactions,
  changeStock
}) {

  const [selectedBook, setSelectedBook] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  const handleTransaction = (type) => {

    if (selectedBook === "") {
      alert("Please select a book.");
      return;
    }

    if (Number(quantity) <= 0) {
      alert("Quantity must be greater than zero.");
      return;
    }

    let amount;

    if (type === "Add Stock") {
      amount = Number(quantity);
    } else {
      amount = -Number(quantity);
    }

    const success = changeStock(
      Number(selectedBook),
      amount,
      type
    );

    if (!success) {

      alert(
        "Transaction cannot be completed. There are not enough copies available."
      );

      return;
    }

    setQuantity(1);

    alert(
      type === "Add Stock"
        ? "Stock added successfully."
        : "Book borrowed successfully."
    );
  };

  return (
    <div className="page">

      <h1>Stock Transactions</h1>

      <div className="form-card">

        <h2>Manage Stock</h2>

        <label>
          Select Book
        </label>

        <select
          value={selectedBook}
          onChange={(e) =>
            setSelectedBook(e.target.value)
          }
        >

          <option value="">
            Select a book
          </option>

          {books.map((book) => (

            <option
              key={book.id}
              value={book.id}
            >
              {book.title} - {book.quantity} available
            </option>

          ))}

        </select>

        <label>
          Quantity
        </label>

        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) =>
            setQuantity(e.target.value)
          }
        />

        <div className="transaction-buttons">

          <button
            type="button"
            className="primary-btn"
            onClick={() =>
              handleTransaction("Add Stock")
            }
          >
            Add Stock
          </button>

          <button
            type="button"
            className="borrow-btn"
            onClick={() =>
              handleTransaction("Borrow")
            }
          >
            Borrow Book
          </button>

        </div>

      </div>

      <div className="table-container">

        <h2>Transaction History</h2>

        <table>

          <thead>

            <tr>
              <th>Book</th>
              <th>Transaction</th>
              <th>Quantity</th>
              <th>Date</th>
            </tr>

          </thead>

          <tbody>

            {transactions.length === 0 ? (

              <tr>
                <td colSpan="4">
                  No transactions yet.
                </td>
              </tr>

            ) : (

              transactions.map(
                (transaction) => (

                  <tr key={transaction.id}>

                    <td>
                      {transaction.bookTitle}
                    </td>

                    <td>
                      {transaction.type}
                    </td>

                    <td>
                      {transaction.quantity}
                    </td>

                    <td>
                      {transaction.date}
                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Transactions;