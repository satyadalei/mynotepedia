require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectToMongoDB = require('./db'); // requre mongo db connection function to connect to mongo DB


//all required modules are above
connectToMongoDB(); // call mongoDb connect function
// mongoose.connect('mongodb://127.0.0.1:27017/keeper');
const app = express(); 
app.use(cors({
//   origin: process.env.ORIGIN_SITE, // here will be domain name -- http://myservice.com
    origin: "https://64580e3e8f69eb26ee488421--extraordinary-biscochitos-4d29cd.netlify.app", // here will be domain name -- http://myservice.com
  credentials:  true
}));
app.use(bodyParser.urlencoded({ extended: true }));
//create store to save session details in DB
const store = new MongoStore({
    mongoUrl:process.env.mongoDBUrl,
    collection: process.env.SESSION_COLLECTION_NAME,
});
app.use(session({
    secret: process.env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 604800000}, //one week
    store: store
}));
// this helps to read json data(that are being sent through req.body) in node.js server // u need to include content-type : application/json in header of the request url
app.use(express.json());
app.get("/",(req,res)=>{
    res.json({"do":"SMILE","start":"Developing something great & keep :) :)"})
})
app.use('/api/auth', require('./routes/authRoute')); // all requests related to api/auth will be redirected to authRoute
app.use('/api/notes', require('./routes/notesRoute')); // all requests related to api/notes will be redirected to notesRoute

//if user requests to an undefined route
// app.use((req, res, next) => {
//        const msg = "Sorry, the requested route was not found." ;
//         const success = false;
//         const error = "invalid request route"
//         res.status(404).json({
//             "msg" : msg,
//             "success" : success,
//             "error" : error
//         });
// });

  
  

const port = process.env.PORT || 7000 ;
app.listen(port, ()=>{
    console.log(`Server started running at ${port}. Have a good day.`);
})