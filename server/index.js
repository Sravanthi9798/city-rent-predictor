require("dotenv").config();
const express=require('express');
const cors=require('cors');
const dataBase = require('./src/config/MongoConnection')
const router = require("./src/routes/authRoute")

const app=express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

dataBase();

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});