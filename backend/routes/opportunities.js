const express = require("express");
const router = express.Router();

const db = require("../db");

// GET all opportunities
router.get("/", (req, res) => {
    const sql = "SELECT * FROM opportunities";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Database error",
                error: err.message
            });
        }

        res.status(200).json(results);
    });
});

// GET one opportunity by ID
router.get("/:id", (req, res) => {
    const id = req.params.id;

    const sql = "SELECT * FROM opportunities WHERE id = ?";

    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Opportunity not found"
            });
        }

        res.status(200).json(results[0]);
    });
});


// UPDATE an opportunity
router.put("/:id", (req, res) => {
    const id = req.params.id;

    const {
        title,
        description,
        research_area,
        faculty_name,
        department,
        required_skills,
        available_positions,
        application_deadline,
        status
    } = req.body;

    if (
        !title ||
        !description ||
        !research_area ||
        !faculty_name ||
        !department ||
        !required_skills ||
        available_positions === undefined ||
        !application_deadline ||
        !["Open", "Closed"].includes(status)
    ) {
        return res.status(400).json({
            message: "All fields are required, and status must be Open or Closed"
        });
    }

    const sql = `
        UPDATE opportunities
        SET title = ?,
            description = ?,
            research_area = ?,
            faculty_name = ?,
            department = ?,
            required_skills = ?,
            available_positions = ?,
            application_deadline = ?,
            status = ?
        WHERE id = ?
    `;

    const values = [
        title,
        description,
        research_area,
        faculty_name,
        department,
        required_skills,
        available_positions,
        application_deadline,
        status,
        id
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Opportunity not found"
            });
        }

        res.status(200).json({
            message: "Opportunity updated successfully"
        });
    });
});

// POST a new opportunity
router.post("/", (req, res) => {
    const {
        title,
        description,
        research_area,
        faculty_name,
        department,
        required_skills,
        available_positions,
        application_deadline
    } = req.body;

    // Basic validation
    if (
        !title ||
        !description ||
        !research_area ||
        !faculty_name ||
        !department ||
        !required_skills ||
        available_positions === undefined ||
        !application_deadline
    ) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const sql = `
        INSERT INTO opportunities
        (
            title,
            description,
            research_area,
            faculty_name,
            department,
            required_skills,
            available_positions,
            application_deadline
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        title,
        description,
        research_area,
        faculty_name,
        department,
        required_skills,
        available_positions,
        application_deadline
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Database error",
                error: err.message
            });
        }

        res.status(201).json({
            message: "Opportunity created successfully",
            id: result.insertId
        });
    });
});


// DELETE an opportunity
router.delete("/:id", (req, res) => {
    const id = req.params.id;

    const sql = "DELETE FROM opportunities WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Opportunity not found"
            });
        }

        res.status(200).json({
            message: "Opportunity deleted successfully"
        });
    });
});


 // CLOSE an opportunity
router.patch("/:id/close", (req, res) => {
    const id = req.params.id;

    const sql = `
        UPDATE opportunities
        SET status = 'Closed'
        WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Opportunity not found"
            });
        }

        res.status(200).json({
            message: "Opportunity closed successfully"
        });
    });
});

module.exports = router;