require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { loadCSV } = require("./src/utils/csvLoader");
const rentRoutes = require("./src/routes/rentRoutes");
const marketRoutes = require("./src/routes/marketRoutes");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

  app.use("/api", rentRoutes);
  app.use("/api", marketRoutes);

  //  START SERVER ONLY AFTER CSV LOAD
(async () => {
  try {
    await loadCSV();

    app.listen(3001, () => {
      console.log("Server running on port 3001");
    });
  } catch (err) {
    console.error("Server failed to start");
    process.exit(1);
  }
})();
