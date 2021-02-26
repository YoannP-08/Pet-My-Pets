const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const mongoose = require('mongoose');

//Import Report model//
const Report = require('../models/Report');


/**
 *Get Route for Reports
 * @returns {array}
 * @description COUCOU
 * @author Jérémie
 */
router.get("", auth, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            const report = await Report.aggregate([{
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user'
                },
            },
                {
                    $lookup: {
                        from: 'posts',
                        localField: 'post_id',
                        foreignField: '_id',
                        as: 'post'
                    },
                },
                {
                    $unset: ["user._id", "user.address", "user.zipCode", "user.city", "user.password"]
                }
            ]);
            res.status(200).json(report);
        } catch (e) {
            res.status(400).json('Error: ' + e)
        }
    }else {
        return res.status(403).json('You are not admin, this request is unauthorized')
    }
});


// GET Report by ID
router.get("/:id", auth, async (req, res) => {
    if (req.user.isAdmin) {
        try {
        const report = await Report.aggregate([{
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user'
            },
        },
            {
                $lookup: {
                    from: 'posts',
                    localField: 'post_id',
                    foreignField: '_id',
                    as: 'post'
                }
            },
            {
                $unset: ["user._id", "user.address", "user.zipCode", "user.city", "user.password", "user.firstname", "user.lastname"]
            },
            {
                $match: { _id: mongoose.Types.ObjectId(req.params.id) }
            }
        ]);
            res.status(200).json(report)
    } catch (e) {
        res.status(400).json('Error: ' + e)
    }
    }else {
        return res.status(403).json('You are not admin, this request is unauthorized')
    }
});

//POST Post
router.post("", auth, async (req, res) => {
    let newReport = new Report(req.body);
    newReport.save()
        .then(newReport => {
            res.status(201).json({ message: "New report successfully created", report: newReport });
        })
        .catch(err => {
            res.status(400).json('A problem occurred during the creation of the new report : ' + err)
        })
});

router.delete("/:id", auth, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            const report = await Report.findByIdAndDelete(req.params.id)
            if (!report) throw Error("No report found")
            res.status(200).json({ message: "Report was successfully deleted" })
        } catch (err) {
            res.status(400).json({ msg: err })
        }
    } else {
        return res.status(403).json('You are not admin or this is not your account. This action is unauthorized')
    }
});

module.exports = router;
