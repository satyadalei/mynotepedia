const mongoose = require('mongoose');
const checkValidObjectId = (req,res,next)=>{
   const id = req.params.noteId;
   const status = mongoose.Types.ObjectId.isValid(id); // true or false
   
   if(status) {
    // if true -- means valid id then proceed
     next()
   }else{
    const msg = "object id is not valid one.Try providing valid object id";
    const success = false;
    const error = "not a valid id"
    res.json({
        "msg" : msg,
        "success" : success,
        "error" : error
    });
   }
}
module.exports = checkValidObjectId;