
import React from "react";
import BookForm from "../components/BookForm";
import BookTable from "../components/BookTable";

function Books({
  books,
  addBook,
  updateBook,
  deleteBook
}) {
  return (
    <div className="page">

      <h1>Book Management</h1>

      <BookForm addBook={addBook} />

      <BookTable
        books={books}
        updateBook={updateBook}
        deleteBook={deleteBook}
      />

    </div>
  );
}

export default Books;
