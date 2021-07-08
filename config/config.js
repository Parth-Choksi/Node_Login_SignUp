const mongoose = require('mongoose');

// set up default mongoose connection
// 1)set default url
// 2)connect with default url 
const mongoDB = 'mongodb://127.0.0.1:27017/database1';

// Create one function for Check Database Connection

const CheckMongoServer = async () => {
    try{
        await mongoose.connect(mongoDB);
        console.log('Connected to MongoDB')
    }
    catch(error) {
        console.log(error);
    }
}

module.exports = CheckMongoServer;
