
const express = require("express");
const router = express.Router();
const db = require("../db");

// GET: Display transaction history
router.get("/", async (req, res) => {
    try {
        const [transactions] = await db.execute(
            "SELECT * FROM transactions ORDER BY id DESC"
        );

        res.json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to load transactions."
        });
    }
});

// POST: Add stock or borrow books
router.post("/", async (req, res) => {
    const { book_id, type, quantity } = req.body;

    const amount = Number(quantity);

    if (!book_id || !Number.isInteger(Number(book_id))) {
        return res.status(400).json({
            message: "Please select a valid book."
        });
    }

    if (!Number.isInteger(amount) || amount <= 0) {
        return res.status(400).json({
            message: "Quantity must be a positive whole number."
        });
    }

    if (type !== "Add Stock" && type !== "Borrow") {
        return res.status(400).json({
            message: "Invalid transaction type."
        });
    }

    let connection;

    try {
        connection = await db.getConnection();

        await connection.beginTransaction();

        // Find the book and lock its record
        const [books] = await connection.execute(
            "SELECT * FROM books WHERE id = ? FOR UPDATE",
            [Number(book_id)]
        );

        if (books.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                message: "Book not found."
            });
        }

        const book = books[0];

        // Check available stock before borrowing
        if (type === "Borrow" && book.quantity < amount) {
            await connection.rollback();

            return res.status(400).json({
                message: "Not enough copies available."
            });
        }

        const newQuantity =
            type === "Add Stock"
                ? book.quantity + amount
                : book.quantity - amount;

        // Update book quantity
        await connection.execute(
            "UPDATE books SET quantity = ? WHERE id = ?",
            [newQuantity, Number(book_id)]
        );

        // Save transaction history
        const transactionType =
            type === "Add Stock" ? "ADD_STOCK" : "BORROW";

        const [result] = await connection.execute(
            `INSERT INTO transactions
            (book_id, user_id, book_title, transaction_type, quantity)
            VALUES (?, NULL, ?, ?, ?)`,
            [
                Number(book_id),
                book.title,
                transactionType,
                amount
            ]
        );

        await connection.commit();

        res.status(201).json({
            message: "Transaction completed successfully.",
            id: result.insertId,
            book_id: Number(book_id),
            bookTitle: book.title,
            quantity: amount,
            type: type,
            newQuantity: newQuantity
        });

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }

        console.error(error);

        res.status(500).json({
            message: "Transaction failed."
        });

    } finally {
        if (connection) {
            connection.release();
        }
    }
});

module.exports = router;
