require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { loadCSV } = require("./src/utils/csvLoader");
const { trainModel } = require("./src/services/mlModel");
const rentRoutes = require("./src/routes/rentRoutes");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

  app.use("/api", rentRoutes);

loadCSV().then(() => {
  trainModel();
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
});
