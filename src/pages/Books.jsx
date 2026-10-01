import React, { useState } from "react";

function BookForm({ addBook }) {

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [isbn, setIsbn] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = (e) => {

    e.preventDefault();

    if (
      title === "" ||
      author === "" ||
      genre === "" ||
      isbn === "" ||
      quantity === ""
    ) {
      alert("Please fill in all fields.");
      return;
    }

    if (Number(quantity) < 0) {
      alert("Quantity cannot be negative.");
      return;
    }

    addBook({
      title: title,
      author: author,
      genre: genre,
      isbn: isbn,
      quantity: quantity
    });

    setTitle("");
    setAuthor("");
    setGenre("");
    setIsbn("");
    setQuantity("");

    alert("Book added successfully.");
  };

  return (
    <form
      className="form-card"
      onSubmit={handleSubmit}
    >

      <h2>Add New Book</h2>

      <label>Title</label>

      <input
        type="text"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <label>Author</label>

      <input
        type="text"
        value={author}
        onChange={(e) =>
          setAuthor(e.target.value)
        }
      />

      <label>Genre</label>

      <input
        type="text"
        value={genre}
        onChange={(e) =>
          setGenre(e.target.value)
        }
      />

      <label>ISBN</label>

      <input
        type="text"
        value={isbn}
        onChange={(e) =>
          setIsbn(e.target.value)
        }
      />

      <label>Initial Quantity</label>

      <input
        type="number"
        min="0"
        value={quantity}
        onChange={(e) =>
          setQuantity(e.target.value)
        }
      />

      <button
        type="submit"
        className="primary-btn"
      >
        Add Book
      </button>

    </form>
  );
}

export default BookForm;