require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { loadCSV } = require("./src/utils/csvLoader");
const authRoutes=require("./src/routes/authRoute");
const rentRoutes = require("./src/routes/rentRoutes");
const marketRoutes = require("./src/routes/marketRoutes");
const mapRoutes = require("./src/routes/mapRoutes");
const dataBase=require("./src/config/MongoConnection");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;
  app.use("/api",authRoutes);
  app.use("/api", rentRoutes);
  app.use("/api", marketRoutes);
  app.use("/api/map", mapRoutes);

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


