const mongoose = require("mongoose");
const dotEnv = require("dotenv");
dotEnv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_DB_URL);
    console.log(`mongo connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
