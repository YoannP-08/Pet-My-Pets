const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Import Comment Model
const Comment = require('../models/Comment');

/**
 * GET all comment
 * @route   GET localhost:4000/api/comments
 * @description get all the comments
 * @access Public
 * @return  array
 */

router.get("/", async (req, res) => {
    try {
        const comments = await Comment.find();

        if (!comments) throw Error('No comments found.');

        res.status(200).json({
            message: 'Success',
            data: comments
        });

    } catch (error) {
        res.status(400).json({ message: error });
    }
});

/**
 * GET one comment
 * @route   GET localhost:4000/api/comments/:id
 * @description get all the comment
 * @access Public
 * @params user_id
 * @return  Object
 */

router.get("/:id", async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id).populate('user_id', ['email', 'username']);

        if (!comment) throw Error('No Comment found.');

        res.status(200).json({
            success: true,
            data: comment
        });
    } catch (error) {
        res.status(400).json({ message: error });
    }
});

/**
 * POST one comment
 * @route   POST localhost:4000/api/comments/
 * @description Post one comment
 * @access Private
 * @return  Object
 */

router.post("/", auth, async (req, res) => {

    const newComment = await new Comment({
        comment: req.body.comment,
        user_id: req.body.user_id,
        post_id: req.body.post_id
    });

    if (req.user) {
        try {
            const comment = await newComment.save();

            if (!comment) throw Error('Something went wrong while saving the comment in the database.');

            res.status(200).json({
                message: 'Comment created successfully.',
                data: comment
            });

        } catch (error) {
            res.status(400).json({ message: error });
        }
    } else {
        return res.status(403).json( {message: 'You are not authenticated. This request is unauthorized.'} );
    };
});

/**
 * DELETE one comment
 * @route   POST localhost:4000/api/comments/
 * @description delete one comment
 * @access Private
 * @params user id
 * @return object
 */

router.delete("/:id", auth, async (req, res) => {
    const comment = await Comment.findById(req.params.id);

    if (req.user.id == comment.user_id || req.user.isAdmin) {
        try {
            if (!comment) throw Error('No Comment found.');

            const removed = await comment.remove();
            if (!removed) throw Error('Something went wrong while trying to delete the comment.')

            res.status(200).json({
                success: true,
                message: 'The comment was deleted successfully!'
            });
        } catch (error) {
            res.status(400).json({ message: error });
        }
    } else {
        return res.status(403).json( {message: 'This is not your comment. This request is unauthorized.'} );
    };
});

/**
 * PUT one comment
 * @route   PUT localhost:4000/api/comments/edit/:id
 * @description Modify the comment
 * @access Private
 * @params user_id
 * @return Object
 */

router.put("/:id", auth, async (req, res) => {
    const checkCommentId = await Comment.findById(req.params.id);

    if (req.user.id == checkCommentId.user_id || req.user.isAdmin) {
        try {
            const commentUpdate = await Comment.findByIdAndUpdate({ _id: req.params.id }, req.body);
            // if (!comment) throw Error ('No Comment found.');

            const commentEdited = await Comment.findById(commentUpdate._id);
            if (!commentEdited) throw Error('Something went wrong while updating the comment in the database.')

            res.status(200).json({
                success: true,
                message: 'Comment updated successfully!',
                data: commentEdited
            });
        } catch (error) {
            res.status(400).json({ message: error });
        }
    } else {
        return res.status(403).json( {message: 'This is not your comment. This request is unauthorized.'} );
    }
});


module.exports = router;
