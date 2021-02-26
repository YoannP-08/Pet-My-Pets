// Used for reset password hash
const mongoose = require("mongoose")
const Schema = mongoose.Schema

const AccessHashSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("AccessHash", AccessHashSchema)