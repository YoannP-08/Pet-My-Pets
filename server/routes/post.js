const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const mongoose = require('mongoose');

//Import Post model//
const Post = require('../models/Post')
const User = require('../models/User')
const Comment = require('../models/Comment');



/**
 *Get Route for Posts
 * @returns {array}
 * @description COUCOU
 * @author Jérémie
 */
router.get("", async (req, res) => {
    try {
        const posts = await Post.aggregate([{
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user'
            },
        },
        {
            $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'post_id',
                as: 'comments'
            },
        },
        {
            $unset: ["user._id", "user.address", "user.zipCode", "user.city", "user.email", "user.password"]
        }
        ]);
        res.status(200).json(posts);
    }
    catch (e) {
        res.status(400).json('Error: ' + e)
    }

});


// GET Post by ID
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.aggregate([{
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user'
            },
        },
        {
            $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'post_id',
                as: 'comments'
            }
        },
        {
            $unset: ["user._id", "user.address", "user.zipCode", "user.city", "user.password", "user.firstname", "user.lastname"]
        },
        {
            $match: { _id: mongoose.Types.ObjectId(req.params.id) }
        }
        ])
        let ArrayCom = [];
        await post[0].comments.map(async comment => {
            let tmp = await Comment.
                findOne({ _id: comment._id }).
                populate('user_id', ['email', 'username']).
                exec();
            ArrayCom.push(tmp);
        });
        setTimeout(() => {
            delete post[0].comments;
            res.status(200).json({ post: post[0], comments: ArrayCom })
        }, 500)

    } catch (e) {
        res.status(400).json('Error: ' + e)
    }
});

//POST Post
router.post("", auth, async (req, res) => {
    let newPost = new Post(req.body);
    newPost.save()
        .then(newPost => {
            res.status(201).json({ message: "New post successfully created", post: newPost });
        })
        .catch(err => {
            res.status(400).json('A problem occurred during the creation of the new post : ' + err)
        })
});

//PATCH Post
router.patch("/:id", auth, async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (post.user_id == req.user.id || req.user.isAdmin) {
        // First param is the id to find, second one is the data updated, the third is the callback
        Post.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, result) => {
            if (err) {
                res.status(400).json({ message: 'Error during editing the post: ' + err });
            } else {
                res.status(200).json({ message: 'Post edited', post: result });
            }
        });
    } else {
        return res.status(403).json('You are not admin or this is not your account. This update is unauthorized')
    }
});


router.delete("/:id", auth, async (req, res) => {
    const post = await Post.aggregate([
        {
            $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'post_id',
                as: 'comments'
            }
        },
        {
            $match: { _id: mongoose.Types.ObjectId(req.params.id) }
        }
    ])

    const comments = post[0].comments;
    if (post[0].user_id == req.user.id || req.user.isAdmin) {
        try {
           await comments.map((comment) => {
                Comment.findByIdAndDelete((comment._id)).then(() => console.log("Comment deleted"))
            })
            const post = await Post.findByIdAndDelete(req.params.id)
            if (!post) throw Error("No user found")

            res.status(200).json({ message: "Post was successfully deleted" })
        } catch (err) {
            res.status(400).json({ msg: err })
        }
    } else {
        return res.status(403).json('You are not admin or this is not your account. This update is unauthorized')
    }
});

module.exports = router;
