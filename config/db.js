const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI)
    console.log('atlas is connected');

  }
  catch (err) {
    console.log(err.message);

  }
}

module.exports = connectDB;