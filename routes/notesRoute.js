const express = require('express');
const router = express.Router();
const Note = require('../models/noteModel'); 
const checkAuthStatus = require('../middlewares/checkauthentication');
const {validationResult, body }= require('express-validator');
const checkValidObjectId = require('../middlewares/checkvalidityofobjectid');
// Route 1 -- FETCH ALL NOTES ------------------------
router.get("/fetchallnotes",checkAuthStatus,async(req,res)=>{
    const userId = req.session.userId;
    try {
        const allNotes = await Note.find({userId : userId });
        const msg = "All notes found";
        const success = true;
        res.json({
            "msg" : msg,
            "success" : success,
            "found notes" : allNotes
        });
    } catch (error) {
        const msg = "internal server error";
        const success = false;
        res.json({
            "msg" : msg,
            "success" : success,
            "error" : error
        });
    }
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
router.delete("/deletenote/:noteId",checkValidObjectId,checkAuthStatus, async(req,res)=>{
   const noteId = req.params.noteId;
   const userId = req.session.userId;
   try {
    const findNote = await Note.findById(noteId); //valid noteId is checked by checkValidObjectId middleware
    // remember if (id) is not checked it will crash the server
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
                // note does not belongs to user
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
});
router.put("/updatenote/:noteId",checkValidObjectId,checkAuthStatus,[
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
   const noteId = req.params.noteId;
   const userId = req.session.userId;
   //first find that note exist or not
  try {
    const findThatNote = await Note.findById(noteId).exec();
    if (!findThatNote) {
        // note does not found
          const msg = "note not found";
          const success = false;
          res.json({
              "msg" : msg,
              "success" : success,
          });
       }else{
            // note found -- check whether that note belongs to user
            if (findThatNote.userId != userId ) {
                const msg = "not authorised to delete note";
                const success = false;
                res.json({
                    "msg" : msg,
                    "success" : success,
                });
            }else{
            // belongs to user now update note
               const {title,description} = req.body;
               const lastModified = new Date;
               const updatedNote = await Note.updateOne({_id:noteId},{title,description,lastModified});
                const msg = "note updated successfully";
                const success = true;
                res.json({
                    "msg" : msg,
                    "success" : success,
                    "updated note" : updatedNote
                });
            }
       }
  } catch (error) {
    console.log(error);
    const msg = "Some Internal Server error";
    const success = false;
    res.json({
        "msg" : msg,
        "success" : success,
        "error" : error
    });
    error.stack
  }
}
});



module.exports = router ;