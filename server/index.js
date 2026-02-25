require("dotenv").config();
const express = require("express");
const cors = require("cors");
const logger = require("./src/utils/logger");

const { loadCSV } = require("./src/utils/csvLoader");
const authRoutes = require("./src/routes/authRoute");
const rentRoutes = require("./src/routes/rentRoutes");
const marketRoutes = require("./src/routes/marketRoutes");
const mapRoutes = require("./src/routes/mapRoutes");
const dataBase = require("./src/config/MongoConnection");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;
app.use("/api", authRoutes);
app.use("/api", rentRoutes);
app.use("/api", marketRoutes);
app.use("/api/map", mapRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err); // Show in console
  logger(req, err); // Save to file

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

async function startServer() {
  try {
    await dataBase();
    await loadCSV();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Server failed:", err.message);
    process.exit(1);
  }
}

startServer();
