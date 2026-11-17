
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../db");

// GET: Retrieve all users
router.get("/", async (req, res) => {
    try {
        const [users] = await db.execute(
            `SELECT id, name, membership_id, role, created_at
             FROM users
             ORDER BY id DESC`
        );

        res.json(users);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to load users."
        });
    }
});

// POST: Register a new user
router.post("/", async (req, res) => {
    try {
        const { name, membershipId, password, role } = req.body;

        if (
            !name?.trim() ||
            !membershipId?.trim() ||
            !password ||
            !role
        ) {
            return res.status(400).json({
                message: "Please fill in all user fields."
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must contain at least 6 characters."
            });
        }

        if (!["Admin", "Librarian", "Member"].includes(role)) {
            return res.status(400).json({
                message: "Invalid user role."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.execute(
            `INSERT INTO users
             (name, membership_id, password, role)
             VALUES (?, ?, ?, ?)`,
            [
                name.trim(),
                membershipId.trim(),
                hashedPassword,
                role
            ]
        );

        res.status(201).json({
            message: "User registered successfully.",
            id: result.insertId
        });

    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "This membership ID already exists."
            });
        }

        console.error(error);
        res.status(500).json({
            message: "Failed to register user."
        });
    }
});

// PUT: Update user details
router.put("/:id", async (req, res) => {
    try {
        const { name, membershipId, role } = req.body;

        if (
            !name?.trim() ||
            !membershipId?.trim() ||
            !["Admin", "Librarian", "Member"].includes(role)
        ) {
            return res.status(400).json({
                message: "Please provide valid user details."
            });
        }

        const [result] = await db.execute(
            `UPDATE users
             SET name = ?, membership_id = ?, role = ?
             WHERE id = ?`,
            [
                name.trim(),
                membershipId.trim(),
                role,
                req.params.id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        res.json({
            message: "User updated successfully."
        });

    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "This membership ID already exists."
            });
        }

        console.error(error);
        res.status(500).json({
            message: "Failed to update user."
        });
    }
});

// DELETE: Remove a user
router.delete("/:id", async (req, res) => {
    try {
        const [result] = await db.execute(
            "DELETE FROM users WHERE id = ?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        res.json({
            message: "User deleted successfully."
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to delete user."
        });
    }
});

// POST: Login using membership ID and password
router.post("/login", async (req, res) => {
    try {
        const { membershipId, password } = req.body;

        if (!membershipId?.trim() || !password) {
            return res.status(400).json({
                message: "Enter your membership ID and password."
            });
        }

        const [users] = await db.execute(
            `SELECT id, name, membership_id, password, role
             FROM users
             WHERE membership_id = ?`,
            [membershipId.trim()]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: "Invalid membership ID or password."
            });
        }

        const user = users[0];

        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Invalid membership ID or password."
            });
        }

        res.json({
            message: "Login successful.",
            user: {
                id: user.id,
                name: user.name,
                membershipId: user.membership_id,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Login failed."
        });
    }
});

module.exports = router;
