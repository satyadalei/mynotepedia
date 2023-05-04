const express = require('express');
const router = express.Router();
const Note = require('../models/noteModel'); 
const checkAuthStatus = require('../middlewares/checkauthentication');
const {validationResult, body }= require('express-validator');
// Route 1 -- FETCH ALL NOTES ------------------------
router.get("/fetchallnotes",checkAuthStatus,async(req,res)=>{
    const userId = req.session.userId;
    console.log(userId);
    const allNotes =await Note.find({userId : userId });
    const msg = "All notes found";
    const success = true;
    res.json({
        "msg" : msg,
        "success" : success,
        "found notes" : allNotes
    });
})
// Route 2 -- ADD NOTE ----------------------------
router.post("/addnote",checkAuthStatus,[
    body('title', "Enter a valid title(Atleast 3 characters)").isLength({min:3}),
    body('description', "Enter a valid description(Atleast 3 characters)").isLength({min:3}),
],async(req,res)=>{
   const result = validationResult(req);
   if (result.errors.length != 0) {
    // error in inputs
        const msg = "invalid credentials";
        const success = false;
        res.json({
            "msg" : msg,
            "success" : success,
            "error" : result.errors
        });
   }else{
    //no error in inputs
    const userId = req.session.userId;
    const {title,description} = req.body;
    try {
         const newNote = new Note({userId,title,description});
         await newNote.save();
         const msg = "note saved successfully";
         const success = true;
         res.json({
             "msg" : msg,
             "success" : success,
             "saved note" : newNote
         });
    } catch (error) {
        console.log(error);
        const msg = "Some Internal Server error";
        const success = false;
        res.json({
            "msg" : msg,
            "success" : success,
            "error" : error
        });
    }
   }
})
// Route 3 -- DELETE NOTE ----------------------------
router.delete("/deletenote/:noteId",checkAuthStatus, async(req,res)=>{
   const noteId = req.params.noteId;
   const userId = req.session.userId;
   const findNote = await Note.findById(noteId);
   if(!findNote){
       //note not found
        const msg = "note not found";
        const success = false;
        res.json({
            "msg" : msg,
            "success" : success,
        });
   }else{
      // note found - check whether note belongs to user
      if(findNote.userId != userId) {
        const msg = "not authorised to delete note";
        const success = false;
        res.json({
            "msg" : msg,
            "success" : success,
        });
      }else{
        //delete note
        await Note.findByIdAndDelete(noteId);
        const msg = "note deleted successfully";
        const success = true;
        res.json({
            "msg" : msg,
            "success" : success,
        });
      }
   }
})



module.exports = router ;