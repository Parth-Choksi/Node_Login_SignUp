const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const User = require('../models/user');
const auth = require('../middlewares/auth')

// Now First Step to Create Routes

router.post('/signup',
    //use check to validate UserSchema 
    [
        check("username", 'Please Enter Valid username').not().isEmpty(),
        check("email", 'Please Enter Valid email').isEmail(),
        check("password", 'Please Enter Valid password').isLength({ min: 4 }),
    ],
    // After check we use validationResult to get error if it valid we store it to userschema
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) // means if get the error
        {
            return res.status(400).json({ errors: errors.array() });
        }
        console.log(req.body);
        const {
            username,
            email,
            password,
        } = req.body;  // req.body is key value pair of data submitted at request time
        try {
            // First check if user already exist
            let user = await User.findOne({ email });
            // exist then error
            if (user) {
                return res.status(400).json({ message: 'User already exist' })
            }
            // else assign Value to Schema
            user = new User({
                username,
                email,
                password
            })

            // After Success we bcrypt password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            // Now we Save 

            await user.save();
            // Now we have create one id
            const payload = {
                user: {
                    id: user.id
                }
            };

            // Create jwt and pass payload which has id
            jwt.sign(payload, "randomString", {
                expiresIn: 10000
            }, (err, token) => {
                if (err) {
                    throw err;
                }
                res.status(200).json({ token });
            })
        } catch (error) {
            console.log(error.message);
            res.status(500).json("Error on data saving");
        }
    }
)

router.post('/login',
    [
        check('email', 'Please Enter Valid email').isEmail(),
        check('password', 'Please Enter Valid password').isLength({ min: 4 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        try {
            // Check user Name
            let user = await User.findOne({ email })
            if (!user) {
                return res.status(400).json({ message: "User Not Exist" })
            }

            // Check Password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Password mismatch" })
            }

            const payload = {
                user: {
                    id: user.id,
                }
            }

            jwt.sign(payload, "randomString", { expiresIn: 10000 }, (err, token) => {
                if (err) {
                    throw err
                }
                res.status(200).json({ token })
            })
        } catch (error) {
            console.error(error.message)
            res.status(500).json("Server Error")
        }
    }
)

router.get('/user',auth,async(req, res)=>{
    try {
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (error) {
        res.send({message:"Error in getting user"})
    }
})

module.exports = router