const mongoose  = require('mongoose')
const DataModel = require('./model')


async function connectToMongoo() {
    try {


       await mongoose.connect(process.env.MONGODB_URL);
        console.log('MongoDB connected successfully');

    } catch (error) {

        console.error('Database connection error:', error);
        process.exit(1);  
    }
}


async function saveTomongo(data) {
    try {

        const newData = new DataModel(data);
        await newData.save();
        console.log('Data saved to mongooDB:', data);
        
    } catch (error) {
        console.error('Error saving to database:', error);
        throw error;

    }
    
}

module.exports = {connectToMongoo, saveTomongo};

