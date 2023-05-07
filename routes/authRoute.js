const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const { validationResult, body } = require('express-validator');
const checkAuthSatus = require('../middlewares/checkauthentication');

router.post("/createuser", [
    body('name', "Enter a valid name").isLength({ min: 3 }),
    body('email', "Enter a valid email").isEmail(),
    body('password', "Enter password atleast 5 characters").notEmpty().isLength({ min: 5 })
], async (req, res) => {
    const result = validationResult(req);
    if (result.errors.length != 0) {
        // there is an error
        const msg = "invalidrCredentials";
        const success = false;
        res.json({
            "msg": msg,
            "success": success,
            "error": result.errors
        });
    } else {
        try {
            // user entered data correctly
            // first check if that user alread exists or not
            const foundUser = await User.findOne({ email: req.body.email });
            if (foundUser) {
                // user found with mail id
                const msg = "userFound";
                const success = false;
                const description = "The user with same mail id already exists. Please login";
                res.json({
                    "msg": msg,
                    "success": success,
                    "description": description
                });
            } else {
                // user is unique and save to database
                const { name, email, password } = req.body;
                const newUser = new User({ name, email, password });
                await newUser.save();
                //user created, now save user id and authenticate it
                req.session.userId = newUser._id;
                req.session.isAuthenticated = true;
                const msg = "userCreated";
                const success = true;
                const description = "A user created successfully";
                res.json({
                    "msg": msg,
                    "success": success,
                    "description": description
                });
            }
        } catch (error) {
            console.log(error);
            const msg = "serverError";
            const success = false;
            const description = "Some Internal Error occured. Try after sometime";
            res.json({
                "msg": msg,
                "success": success,
                "description": description
            });
        }
    }
});
router.post("/login", [
    body('email', "Enter a valid email").isEmail(),
    body('password', "Enter password atleast 5 characters").notEmpty()
], async (req, res) => {
    const result = validationResult(req);
    if (result.errors.length != 0) {
        // there is an error
        const msg = "invalid credentials";
        const success = false;
        res.json({
            "msg": msg,
            "success": success,
            "error": result.errors
        });
    }
    try {
        const { email, password } = req.body;
        //find user if exists or not
        const foundUser = await User.findOne({ email: email });
        if (foundUser) {
            //user found now check pasword
            if (foundUser.password === password) {
                //password matched now authenticate to user
                req.session.isAuthenticated = true;
                req.session.userId = foundUser._id;
                // res.redirect("/api/auth/getuser"); // not redirecting in thunder client(vs code)
                const msg = "userLogedIn";
                const success = true;
                res.json({
                    "msg": msg,
                    "success": success,
                });
                //it may actually redirecting but not showing in thunder client
            } else {
                const msg = "Incorrect password";
                const success = false;
                res.json({
                    "msg": msg,
                    "success": success
                });
            }
        } else {
            const msg = "user not found";
            const success = false;
            const description = "Sory This user does not exists. Please create account.";
            res.json({
                "msg": msg,
                "success": success,
                "description": description
            });
        }
    } catch (error) {
        const msg = "internal error";
        const success = false;
        const description = "There is some internal server error";
        res.json({
            "msg": msg,
            "success": success,
            "description": description
        });
    }
});
router.get('/logout', checkAuthSatus, async (req, res) => {
    req.session.destroy();
    const msg = "logedOut";
    const success = true;
    const description = "User loged out successfully";
    res.json({
        "msg": msg,
        "success": success,
        "description": description
    });
})
router.get("/getuser", checkAuthSatus, async (req, res) => {
    //user is already authenticated in the middleware no need to check again
    const findUser = await User.findById(req.session.userId).select("-password");
    const msg = "user found";
    const success = true;
    res.json({
        "msg": msg,
        "success": success,
        "user": findUser
    });
})
module.exports = router;