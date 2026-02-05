const mongoose = require("mongoose");

const dataBase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // just this is enough in Mongoose 7+
    console.log("MongoDB Connection is Successful");
  } catch (err) {
    console.log("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = dataBase;
