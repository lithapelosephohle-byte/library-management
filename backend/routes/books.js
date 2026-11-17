
const express = require("express");
const router = express.Router();
const db = require("../db");

// GET: Display all books
router.get("/", async (req, res) => {
    try {
        const [books] = await db.execute(
            "SELECT * FROM books ORDER BY id DESC"
        );

        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to get books." });
    }
});

// POST: Add a new book
router.post("/", async (req, res) => {
    try {
        const { title, author, genre, isbn, quantity } = req.body;

        if (!title?.trim() || !author?.trim() ||
            !genre?.trim() || !isbn?.trim()) {
            return res.status(400).json({
                message: "Please fill in all book fields."
            });
        }

        const stock = Number(quantity);

        if (!Number.isInteger(stock) || stock < 0) {
            return res.status(400).json({
                message: "Quantity must be a whole number and cannot be negative."
            });
        }

        const [result] = await db.execute(
            `INSERT INTO books (title, author, genre, isbn, quantity)
             VALUES (?, ?, ?, ?, ?)`,
            [
                title.trim(),
                author.trim(),
                genre.trim(),
                isbn.trim(),
                stock
            ]
        );

        res.status(201).json({
            message: "Book added successfully.",
            id: result.insertId
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "A book with this ISBN already exists."
            });
        }

        console.error(error);
        res.status(500).json({ message: "Failed to add book." });
    }
});

// PUT: Update a book
router.put("/:id", async (req, res) => {
    try {
        const { title, author, genre, isbn, quantity } = req.body;
        const stock = Number(quantity);

        if (!title?.trim() || !author?.trim() ||
            !genre?.trim() || !isbn?.trim()) {
            return res.status(400).json({
                message: "Please fill in all book fields."
            });
        }

        if (!Number.isInteger(stock) || stock < 0) {
            return res.status(400).json({
                message: "Quantity must be a whole number and cannot be negative."
            });
        }

        const [result] = await db.execute(
            `UPDATE books
             SET title = ?, author = ?, genre = ?, isbn = ?, quantity = ?
             WHERE id = ?`,
            [
                title.trim(),
                author.trim(),
                genre.trim(),
                isbn.trim(),
                stock,
                req.params.id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Book not found."
            });
        }

        res.json({ message: "Book updated successfully." });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "A book with this ISBN already exists."
            });
        }

        console.error(error);
        res.status(500).json({ message: "Failed to update book." });
    }
});

// DELETE: Remove a book
router.delete("/:id", async (req, res) => {
    try {
        const [result] = await db.execute(
            "DELETE FROM books WHERE id = ?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Book not found."
            });
        }

        res.json({ message: "Book deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete book." });
    }
});

module.exports = router;
