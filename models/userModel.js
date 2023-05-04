const  mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name : {
        type : String, // accepts string type input data
        required : true // it makes mandatory to get data
    },
    email : {
        type : String,
        required : true,
        unique : true // unique will allow exactly only one email -- in future no two users will have same email
    },
    password : {
        type : String,
        required : true
    },
    // to store from when user is registered
    date : {
        type : Date, // gives a Date including time
        default : Date.now  // calls method & gives date when an input sent into the schema
    }
});

// here we are exporting a model using a particular shcema
module.exports = mongoose.model('User',userSchema);