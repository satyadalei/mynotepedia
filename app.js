require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const connectToMongoDB = require('./db'); // requre mongo db connection function to connect to mongo DB


//all required modules are above
connectToMongoDB(); // call mongoDb connect function
// mongoose.connect('mongodb://127.0.0.1:27017/keeper');
const app = express(); 
app.use(bodyParser.urlencoded({ extended: true }));
//create store to save session details in DB
const store = new MongoStore({
    mongoUrl:process.env.mongoDBUrl,
    collection: 'sessions',
});
app.use(session({
    secret: process.env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 604800000 }, //one week
    store: store
}));
// this helps to read json data(that are being sent through req.body) in node.js server // u need to include content-type : application/json in header of the request url
app.use(express.json());

app.use('/api/auth', require('./routes/authRoute')); // all requests related to api/auth will be redirected to authRoute
app.use('/api/notes', require('./routes/notesRoute')); // all requests related to api/notes will be redirected to notesRoute

const port = 7000 || process.env.PORT ;
app.listen(port, ()=>{
    console.log(`Server started running at ${port}. Have a good day.`);
})