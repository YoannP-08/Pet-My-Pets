const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');

//Import DonationAd model//
const DonationAd = require('../models/DonationAd')

// Initialise the storage for the pictures
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

const upload = multer({ storage: storage });

// GET All donation ads
// @route GET localhost:4000/api/donationads
// @description get all donation ads in db
// @access Public
// @returns {array}
router.get("/", async (req, res) => {
    try {
        const donationAd = await DonationAd.find().populate('user_id', ["firstname", "lastname", "username", "email", "isAdmin"])
        if (donationAd) {
            res.status(200).json(donationAd)
        } else {
            res.status(400).json({ 'Error': 'Not found' })
        }
    } catch (err) {
        res.status(400).json({ Error: err })
    }
});

// GET One donation ad by ID
// @route GET localhost:4000/api/donationads/:id
// @description get one donation in db
// @params donation id
// @access Private with middleware auth. Token belongs to user or admin.
// @returns {object}
router.get("/:id", async (req, res) => {
    try {
        const donationAd = await DonationAd.findById(req.params.id).populate('user_id', ["firstname", "lastname", "username", "email", "isAdmin"])
        if (donationAd) {
            res.status(200).json({ message: "Success", data: donationAd })
        } else {
            res.status(400).json({ 'Error': 'Not found' })
        }
    } catch (err) {
        res.status(400).json({ Error: err })
    }
});

// POST Create new donation ad
// @route post localhost:4000/api/donationads
// @description Adds new donation
// @access Private with middleware auth. Token belongs to user or admin.
// @returns {object}
router.post("/", upload.single('photo'), auth, async (req, res) => {
    if (req.user) {
        try {
            const newDonationAd = new DonationAd({
                title: req.body.title,
                description: req.body.description,
                zipCode: req.body.zipCode,
                user_id: req.body.user_id,
                photo: {
                    data: fs.readFileSync(path.resolve(__dirname, '../uploads/', req.file.filename)),
                    contentType: 'image/png'
                },
                animalType: req.body.animalType
            });
            const donationAd = await newDonationAd.save()
            if (donationAd) {
                res.status(200).json({ message: "New Donation Ad Created", data: donationAd })
            } else {
                res.status(400).json({ 'Error': 'Something went wrong' })
            }
        } catch (err) {
            res.status(400).json({ Error: err })
        }
    } else {
        return res.status(403).json('You are not connected. This request is unauthorized')
    }
})

// DELETE One donation ad
// @route delete localhost:4000/api/donationads/:id
// @description Delete donation
// @params donation id
// @access Private with middleware auth. Token belongs to user or admin.
// @returns {object}
router.delete("/:id", auth, async (req, res) => {
    const donationAdId = await DonationAd.findById(req.params.id)

    if (req.user.id == donationAdId.user_id || req.user.isAdmin) {
        try {
            const donationAd = await DonationAd.findByIdAndDelete(req.params.id);
            if (donationAd) {
                res.status(200).json({ message: "Donation Ads Deleted" })
            } else {
                res.status(400).json({ 'Error': 'Something went wrong' })
            }
        } catch (err) {
            res.status(400).json({ Error: err })
        }
    } else {
        return res.status(403).json({ message: 'This request is unauthorized' })
    }
})

// PUT Edit one donation ad
// @route patch localhost:4000/api/donationads/:id
// @description: Edit donation
// @params donation id
// @access Private with middleware auth. Token belongs to user or admin.
// @returns {object}
router.put("/:id", upload.single('photo'), auth, async (req, res) => {
    const donationAdId = await DonationAd.findById(req.params.id)
    let donationAd = ''
    if (req.user.id == donationAdId.user_id || req.user.isAdmin) {
        try {
            if (req.file) {
                const newDonationAd = {
                    title: req.body.title,
                    description: req.body.description,
                    zipCode: req.body.zipCode,
                    user_id: req.body.user_id,
                    photo: {
                        data: fs.readFileSync(path.resolve(__dirname, '../uploads/', req.file.filename)),
                        contentType: 'image/png'
                    },
                    animalType: req.body.animalType
                };
                donationAd = await DonationAd.findByIdAndUpdate({ _id: req.params.id }, newDonationAd)
            }
            else {
                donationAd = await DonationAd.findByIdAndUpdate({ _id: req.params.id }, req.body)
            }
            const newdonationAd = await DonationAd.findById(donationAd._id)
            if (donationAd) {
                res.status(200).json({ message: "Donation Ads Modified", data: newdonationAd })
            } else {
                res.status(400).json({ 'Error': 'Something went wrong' })
            }
        } catch (err) {
            res.status(400).json({ Error: err })
        }
    } else {
        return res.status(403).json({ message: 'This request is unauthorized' })
    }
})

module.exports = router;
