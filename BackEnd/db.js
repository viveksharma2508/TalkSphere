const mongoose = require('mongoose');

async function connection(uri){
    if (!uri) {
        throw new Error('MONGODB_URL is missing');
    }
    try{
        await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        heartbeatFrequencyMS: 10000,
    });
    console.log('Connected to MongoDB');
    return mongoose.connection;
    } catch(error){
        console.error('MongoDb connection error', error.message);
        throw error;
    }

}

module.exports = connection;

