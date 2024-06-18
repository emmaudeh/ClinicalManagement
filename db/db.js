const mongoose = require("mongoose")
//const MONGO_URI= "mongodb+srv://herve:beito12345@cluster0.s6tm9.mongodb.net/Hopistal?retryWrites=true&w=majority"
//const MONGO_URI= "mongodb+srv://rosetteoelsa:nGoUEIV1HvOryY3O@cluster0.s6tm9.mongodb.net/Hopistal?retryWrites=true&w=majority"
const MONGO_URI= 'mongodb+srv://rosetteoelsa:nGoUEIV1HvOryY3O@cluster0.85vln98.mongodb.net/Hopistal?retryWrites=true&w=majority&appName=Cluster0'
const MongoDB = mongoose.createConnection(MONGO_URI);

MongoDB.on('connected', () => {
    console.log('Connected to DashboardDB MongoDB');
});

MongoDB.on('error', (err) => {
    console.error('Error connecting to DashboardDB MongoDB:', err);
    process.exit(1);
});

module.exports=MongoDB