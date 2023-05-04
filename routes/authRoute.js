const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const {validationResult, body }= require('express-validator');
const checkAuthentication = require('../middlewares/checkauthentication');

router.post("/creatuser",[
    body('name', "Enter a valid name").isLength({min:3}),
    body('email', "Enter a valid email").isEmail(),
    body('password', "Enter password atleast 5 characters").notEmpty().isLength({min:5})
],async (req,res)=>{
    const result = validationResult(req);
    if (result.errors.length != 0) {
        // there is an error
        res.send("You have entered some invalid inputs. Please input valid credentials");
    }else{
       try {
            // user entered data correctly
            // first check if that user alread exists or not
            const foundUser = await User.findOne({email: req.body.email});
            if (foundUser) {
            // user found with mail id
            res.send("The user with same mail id already exists. Please login");
            }else{
                // user is unique and save to database
                const {name,email,password} = req.body;
                const newUser = new User({name,email,password});
                await newUser.save();
                //user created, now save user id and authenticate it
                req.session.userId = newUser._id;
                req.session.isAuthenticated = true;
                res.send(newUser);
            }
       } catch (error) {
          console.log(error);
          res.send("Some Internal Error occured. Try after sometime");
       }
    } 
});

router.post("/login",[
    body('email', "Enter a valid email").isEmail(),
    body('password', "Enter password atleast 5 characters").notEmpty()
],async(req,res)=>{
    const result = validationResult(req);
    if (result.errors.length != 0) {
        // there is an error
        res.send("You have entered some invalid inputs. Please input valid credentials");
    }
    try {
        const {email,password} = req.body;
        //find user if exists or not
        const foundUser = await User.findOne({email:email});
        if(foundUser) {
            //user found now check pasword
            if (foundUser.password === password) {
                //password matched now authenticate to user
                req.session.isAuthenticated = true;
                req.session.userId = foundUser._id;
                res.redirect("/getuser");
                //it may actually redirecting but not showing in thunder client
            }else{
                res.send("Incorrect password. Please try again.");
            }
        }else{
            res.send("Sory This user does not exists. Please create account.")
        }
    } catch (error) {
        res.send("There is some internal server error");
    }
});
router.get("/getuser",checkAuthentication,async (req,res)=>{
    //user is already authenticated in the middleware no need to check again
    const findUser = await User.findById(req.session.userId).select("-password");
    res.send(findUser);
})
module.exports = router;