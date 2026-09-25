const express = require("express");
const cors = require("cors");
const db = require("./db");
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());


// Test API
app.get("/api/test", (req, res) => {
    res.json({
        message: "Backend is working!"
    });
});


// Register API
app.post("/api/register", async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    try {

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users (name, email, password)
            VALUES (?, ?, ?)
        `;

        db.run(
            sql,
            [name, email, hashedPassword],
            function (err) {

                if (err) {

                    if (err.message.includes("UNIQUE")) {
                        return res.status(400).json({
                            message: "Email already registered"
                        });
                    }

                    console.error(err);

                    return res.status(500).json({
                        message: "Registration failed"
                    });
                }

                res.status(201).json({
                    message: "Registration successful",
                    userId: this.lastID
                });
            }
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Registration failed"
        });
    }
});


// Login API
app.post("/api/login", async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    const sql = `
        SELECT * FROM users
        WHERE email = ?
    `;

    db.get(sql, [email], async (err, user) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                message: "Login failed"
            });
        }

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        res.json({
            message: "Login successful",

            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    });
});


// Start server
const PORT = 5000;

app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});