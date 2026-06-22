const mongoose = require('mongoose');
const envSecret = require('./env');
const { startInterestDecayJob } = require('../jobs/interestDecayJob');
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(envSecret.MONGO_URI);
        console.log(`mongodb connected: ${conn.connection.host}`);;
        startInterestDecayJob();

    } catch (error) {
        console.log('mongodb connection error ', error.message);
        process.exit(1);
    }
}

module.exports = connectDB;
