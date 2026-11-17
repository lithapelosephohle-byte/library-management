
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");

// Import API routes
const booksRoutes = require("./routes/books");
const transactionsRoutes = require("./routes/transactions");
const usersRoutes = require("./routes/users");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/books", booksRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/users", usersRoutes);

// Test backend and database connection
app.get("/api/health", async (req, res) => {
    try {
        const connection = await db.getConnection();
        connection.release();

        res.json({
            message: "Backend and MySQL are connected successfully!"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Database connection failed."
        });
    }
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
