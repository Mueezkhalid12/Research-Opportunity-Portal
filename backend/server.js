require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./db");
const opportunityRoutes = require("./routes/opportunities");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Research Opportunity Portal API is running"
    });
});

app.use("/api/opportunities", opportunityRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});