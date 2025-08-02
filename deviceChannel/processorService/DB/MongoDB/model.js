const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    device:{type :Number, required: true},
    temperature:{ type: Number, required: true },
    humidity:{ type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

const DataModel = mongoose.model('Data', dataSchema);

module.exports = DataModel;  
