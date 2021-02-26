const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const { sendResetPasswordEmail, sendWelcomeEmail } = require('../mail/mailer');



//Import User model//
const User = require('../models/User');
const DonationAd = require('../models/DonationAd');
const Keeper = require('../models/KeeperAd');
const AccessHash = require('../models/AccessHash');

// GET All users
// @route GET localhost:4000/api/users
// @description: get all users in db
// @access Private
router.get("/", auth, async (req, res) => {
    if (req.user.isAdmin) {
        User.find()
            .select('-password')
            .then(users => res.json(users))
            .catch(err => res.status(400).json('Error:' * err));
    }
    else {
        return res.status(403).json('You are not admin, this request is unauthorized')
    }
});

// POST
// @route POST localhost:4000/api/users
// @description: post to receive the reset password email
// @access Public
router.post('/reset-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        //check if user exist
        if (!user) {
            return res.status(422).json({ "Error": "User doesn't exit" });
        }
        //check if he already have the hash sent
        const hasHash = await AccessHash.findOne({ user_id: user._id });
        if (hasHash) {
            return res.status(422).json({ "Error": "Email already sent" });
        }
        //if not then send the hash
        const hash = new AccessHash({ user_id: user._id });
        await hash.save();
        //Send Email
        await sendResetPasswordEmail({ toUser: user, hash: hash._id });
        return res.status(200).json({ message: "Please check your Email to reset your password" });

    } catch {
        return res.status(422).json({ "Error": "Something went wrong" });
    }
})
// PATCH
// @route PATCH localhost:4000/api/users
// @description: patch to reset password
// @access Private because of the special link sent
router.patch('/reset-password/confirmation', async (req, res) => {
    const { password, hash } = req.body;

    try {

        const aHash = await AccessHash.findOne({ _id: hash });
        if (!aHash || !aHash.user_id) {
            return res.status(422).json({ 'Error': 'Cannot reset password!' })
        }
        await User.findByIdAndUpdate({ _id: aHash.user_id }, { password: password },
            { new: true, useFindAndModify: false }, (err, result) => {
                if (err) {
                    res.status(400).json({ message: 'Error during password change: ' + err });
                } else {
                    res.status(200).json({ message: 'Password Successfully Changed' });
                }
            }).then(aHash.remove())
    } catch {
        return res.status(422).json({ "Error": "Something went wrong" });
    }

})

// GET One user by ID
// @route GET localhost:4000/api/users/:id
// @description: get one user in db
// access Private
router.get("/:id", auth, async (req, res) => {

    try {
        const user = await User.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(req.params.id) }
            },
            {
                $lookup: {
                    from: 'keepers',
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'keepers'
                },
            },
            {
                $lookup: {
                    from: 'donationads',
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'donationads'
                }
            },
            {
                $unset: ["password"]
            }
        ])
            ;
        if (user.length > 0) {
            res.status(200).json({ user: user[0] });
        } else {
            res.status(400).json("No user found");
        }
    } catch (e) {
        res.status(400).json('Error: ' + e);
    }
});

// GET User info on user connected
// @route GET localhost:4000/api/users/auth/info
// @description: get user connected via token
// access private
router.get("/auth/info", auth, async (req, res) => {
    await User.findById(req.user.id)
        .select('-password')
        .then(user => res.json(user));
});

// POST Create New User
// @route post localhost:4000/api/users/signup
// @description: Register new user (Sign-up)
// @access Public
router.post("/signup", async (req, res) => {
    //Destructure object newUser
    const { lastname, firstname, username, email, password, address, zipCode, city, isAdmin } = new User(req.body)
    const userEmail = await User.findOne({ email: email })
    const userUsername = await User.findOne({ username: username })
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    if (!lastname || !firstname || !username || !email || !password || !address || !zipCode || !city) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }
    if (!salt) throw Error('Something went wrong with bcrypt');

    if (!hash) throw Error('Something went wrong hashing the password');

    if (userEmail) {
        return res.status(400).json({ message: `User already register with this email:${email}` })
    }
    if (userUsername) {
        return res.status(400).json({ message: `Username already register with this username:${username}` })
    }
    if (lastname.length < 1) {
        return res.status(400).json({ message: `Lastname should be more than 1 character` })
    }
    if (firstname.length < 1) {
        return res.status(400).json({ message: `Firstname should be more than 1 character` })
    }
    if (username.length < 1) {
        return res.status(400).json({ message: `Lastname should be more than 1 character` })
    } else if (!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        return res.status(400).json({ message: `${email} is not a valid email` })
    }

    try {
        const newUser = new User({
            lastname,
            firstname,
            username,
            email,
            password: hash,
            address,
            zipCode,
            city,
            isAdmin
        });
        await sendWelcomeEmail({toUser: newUser});
        const savedUser = await newUser.save();
        if (!savedUser) throw Error("Something went wrong while saving the user")
        const token = await jwt.sign({ id: savedUser._id, isAdmin: savedUser.isAdmin }, process.env.JWT_SECRET, {
            expiresIn: 86400 //24hours
        });

        res.status(200).json({
            token,
            user: {
                id: savedUser.id,
                email: savedUser.email,
                lastname: savedUser.lastname,
                firstname: savedUser.firstname,
                username: savedUser.username,
                password: hash,
                address: savedUser.address,
                zipCode: savedUser.zipCode,
                city: savedUser.city,
                isAdmin: savedUser.isAdmin,
            }
        });
    } catch (err) {
        res.status(400).json({ msg: err })
    }
})

// POST Login User
// @route post localhost:4000/api/users/signin
// @description: Login user (Sign-in)
// @access Public

router.post("/signin", async (req, res) => {
    //Destructure object newUser
    const { email, password } = new User(req.body)
    const user = await User.findOne({ email })
    const userEmail = await User.findOne({ email: email })

    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    if (!userEmail) {
        return res.status(400).json({ message: `User with this email:${email} does not exist` })
    }

    // Validate password
    if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = await jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
            expiresIn: 86400 //24hours
        });
        res.status(200).json({
            token,
            user: {
                id: user.id,
                lastname: user.lastname,
                firstname: user.firstname,
                username: user.username,
                address: user.address,
                zipCode: user.zipCode,
                city: user.city,
                isAdmin: user.isAdmin,
                email: user.email
            }
        });
    }
})

// PATCH edit user
// @route patch localhost:4000/api/users/:id
// @description: Edit profile
// @access Private
router.patch("/:id", auth, async (req, res) => {
    if (req.user.id == req.params.id || req.user.isAdmin) {

        const id = req.params.id;
        const crtPassword = req.body.current_password;
        const newPassword = req.body.new_password;
        const userTest = await User.findById(id);

        if (crtPassword){
            if (await bcrypt.compare(crtPassword, userTest.password)){
                User.findByIdAndUpdate({ _id: id }, { password: newPassword },
                    { new: true, useFindAndModify: false }, (err, result) => {
                        if (err) {
                            res.status(400).json({ message: 'Error during editing the user: ' + err });
                        }else{
                            res.status(200).json({ message: 'User edited', user: result });
                        }
                    });
            }else{
                res.status(400).json({ message: 'Error during editing the user'});
            }
        }else{

            // First param is the id to find
            // second one is the data updated
            // the third is options returning user after update and disables warning msg in console
            // the fourth is callback
            User.findByIdAndUpdate(req.params.id, req.body, { new: true, useFindAndModify: false }, (err, result) => {
                if (err) {
                    res.status(400).json({ message: 'Error during editing the user: ' + err });
                } else {
                    res.status(200).json({ message: 'User edited', user: result });
                }
            });
        }
    }
    else {
        return res.status(403).json('You are not admin or this is not your account. This update is unauthorized')
    }
});

// DELETE One User
// @route delete localhost:4000/api/users/:id
// @description: Delete user
// @access Private

router.delete("/:id", auth, async (req, res) => {
    if (req.user.id == req.params.id || req.user.isAdmin) {
        const user = await User.aggregate([
            {
                $lookup: {
                    from: 'donationads',
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'donationAds'
                }
            },
            {
                $lookup: {
                    from: 'keepers',
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'keeper'
                }
            },
            {
                $match: { _id: mongoose.Types.ObjectId(req.params.id) }
            }
        ]);
        const donationAds = user[0].donationAds;
        const keeper = user[0].keeper;
        // res.json({
        //     user: user,
        //     don: donationAds,
        //     keep: keeper
        // })
        try {
            await donationAds.map((donation) => {
                DonationAd.findByIdAndDelete(donation._id).then(() => console.log("Donation ad deleted"));
            });
            await keeper.map((keep) => {
                Keeper.findByIdAndDelete(keep._id).then(() => console.log("Keeper ad deleted"))
            });
            const user = await User.findByIdAndDelete(req.params.id)
            if (!user) throw Error("No user found")
            res.status(200).json({ message: "User was successfully deleted" })
        } catch (err) {
            res.status(400).json({ msg: err })
        }
    }
    else {
        return res.status(403).json('You are not admin or this is not your account. This delete action is unauthorized')
    }
})

module.exports = router;
