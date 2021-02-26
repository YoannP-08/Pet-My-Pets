const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const CommentSchema = new Schema({
    comment: {
        type: String,
        required: true,
        min: 1,
        max: 255
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    post_id: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model("Comment", CommentSchema)