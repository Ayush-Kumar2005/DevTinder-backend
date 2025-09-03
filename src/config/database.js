const mongoose = require('mongoose');

const connectDB = async () =>{
    await mongoose.connect(
        "mongodb+srv://codeWithAyush:3G4fOLRJ07kOTaN3@namastenode.pvvryql.mongodb.net/devTinder"
    );


    //for checking error part
    //throw new Error("Simulated DB connection error for testing");
};

module.exports = connectDB;

