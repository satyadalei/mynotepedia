const express = require('express');
const router = express.Router();

router.get("/", (req,res)=>{
    res.send("Hello you are in --> notes Home route");
})

module.exports = router ;