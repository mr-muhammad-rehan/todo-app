const express = require("express");
require('dotenv').config();
const app = express();



app.use(express.json());

//MongoDb
const mongoose = require("mongoose"); 
mongoose
    .connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.ot9pbd0.mongodb.net/`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB", err));

// CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, PATCH, DELETE'); // Corrected 'Access-Control-Allow-Methods'
        return res.status(200).json({});
    }
    next();
});



//Routes
const todosRoutes = require('./api/routes/todo.routes');
app.use('/todos', todosRoutes);

module.exports = app;