require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/learning-management-system';
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'phone';
const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
    MONGODB_URI,
    PORT,
    JWT_SECRET,
    NODE_ENV
 };

