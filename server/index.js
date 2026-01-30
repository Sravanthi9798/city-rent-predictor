require("dotenv").config();
const express = require("express");
const cors = require("cors");

const dataBase = require("./src/config/MongoConnection");

const authRoutes = require("./src/routes/authRoute");
const rentRoutes = require("./src/routes/rentRoutes");
const { loadCSV } = require("./src/utils/csvLoader");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

dataBase();

loadCSV().then(() => {
console.log("Housing CSV loaded");

app.use("/api/auth", authRoutes);

app.use("/api/rent", rentRoutes);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
