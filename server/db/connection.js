const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database Connected');
        return mongoose.connection;
    } catch (err) {
        console.error('Could not connect to MongoDB', err);
        process.exit(1); // Exit the process with a non-zero status code
    }
};

module.exports = connectDB;