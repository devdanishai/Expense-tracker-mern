const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config({ path : "./config.env"});
const port = process.env.PORT || 5000;

// Use middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const connectDB = require('./db/connection');

// Using routes
app.use(require('./routes/route'));

connectDB().then(db => {
    if (!db) return process.exit(1);

    // Listen to the HTTP server
    app.listen(port, () => {
        console.log(`Server is running on port: http://localhost:${port}`);
    });

    app.on('error', err => console.log(`Failed To Connect with HTTP Server : ${err}`));
}).catch(error => {
    console.log(`Connection Failed... ${error}`);
});