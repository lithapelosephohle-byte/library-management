import React, { useState } from "react";

function BookTable({
  books,
  updateBook,
  deleteBook
}) {

  const [editingId, setEditingId] =
    useState(null);

  const [editBook, setEditBook] =
    useState({});

  const startEdit = (book) => {

    setEditingId(book.id);
    setEditBook(book);
  };

  const saveEdit = () => {

    if (
      editBook.title === "" ||
      editBook.author === "" ||
      editBook.genre === "" ||
      editBook.isbn === ""
    ) {
      alert("Please fill in all fields.");
      return;
    }

    updateBook(editBook);

    setEditingId(null);
  };

  return (
    <div className="table-container">

      <h2>Book List</h2>

      <table>

        <thead>

          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>ISBN</th>
            <th>Quantity</th>
            <th>Actions</th>
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

              {editingId === book.id ? (

                <>
                  <td>
                    <input
                      value={editBook.title}
                      onChange={(e) =>
                        setEditBook({
                          ...editBook,
                          title: e.target.value
                        })
                      }
                    />
                  </td>

                  <td>
                    <input
                      value={editBook.author}
                      onChange={(e) =>
                        setEditBook({
                          ...editBook,
                          author: e.target.value
                        })
                      }
                    />
                  </td>

                  <td>
                    <input
                      value={editBook.genre}
                      onChange={(e) =>
                        setEditBook({
                          ...editBook,
                          genre: e.target.value
                        })
                      }
                    />
                  </td>

                  <td>
                    <input
                      value={editBook.isbn}
                      onChange={(e) =>
                        setEditBook({
                          ...editBook,
                          isbn: e.target.value
                        })
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      min="0"
                      value={editBook.quantity}
                      onChange={(e) =>
                        setEditBook({
                          ...editBook,
                          quantity:
                            Number(e.target.value)
                        })
                      }
                    />
                  </td>

                  <td>

                    <button
                      className="save-btn"
                      onClick={saveEdit}
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
                  <td>{book.title}</td>

                  <td>{book.author}</td>

                  <td>{book.genre}</td>

                  <td>{book.isbn}</td>

                  <td>
                    {book.quantity}

                    {book.quantity < 2 && (
                      <span className="warning">
                        Low Stock
                      </span>
                    )}
                  </td>

                  <td>

                    <button
                      className="edit-btn"
                      onClick={() =>
                        startEdit(book)
                      }
                    >
                      Update
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => {

                        if (
                          window.confirm(
                            "Delete this book?"
                          )
                        ) {
                          deleteBook(book.id);
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
  );
}

export default BookTable;