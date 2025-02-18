const mongoose = require('mongoose');

const MONGO_URL = `${process.env.DATABASE_URL}${process.env.DATABASE_PASSWORD}@cluster2.6x7pj.mongodb.net/`
const dbConnection = async () => {
    try {
        await mongoose.connect(MONGO_URL,{
            dbName: process.env.DATABASE_NAME,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.log(error)
        console.error('MongoDB connection failed');
        process.exit(1);
    }
};

module.exports = { dbConnection };
