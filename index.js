const express = require('express');// import express
const bodyParser = require('body-parser');// import body-parser
//const cors = require('cors');
const mongoose = require('mongoose');// import mongoose
const app = express(); // create express app

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;
app.listen(port, () => {console.log(`Server is running on the port: ${port}.`);});
//run the application => node index.js

const Contact = require("./routes/Contact");
app.use("/api", Contact);
// /api/contact
// connect to the database
// mongoose is a a popular ODM (Object Data Modeling) library for MongoDB and Node.js
const db = "mongodb://0.0.0.0:27017/project_mongoose_1";
const connectToDb = async () =>{
    try{
        await mongoose.connect(db );
        console.log('Connected to the database');
    }catch(err){
        console.log('Error: ' + err);
        process.exit(1); // exit the process
    }
}


connectToDb();


