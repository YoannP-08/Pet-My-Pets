const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = new Schema({
    lastname: {
        type: String,
        required: true,
        min: 1,
        max: 255
    },
    firstname: {
        type: String,
        required: true,
        min: 1,
        max: 255
    },
    username: {
        type: String,
        required: true,
        min: 1,
        max: 50
    },
    address: {
        type: String,
        required: true,
        min: 4,
        max: 255
    },
    city: {
        type: String,
        required: true,
        min: 4,
        max: 255
    },
    zipCode: {
        type: String,
        required: true,
        max: 10
    },
    email: {
        type: String,
        required: true,
        unique: true,
        min: 4,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 4,
        max: 1000
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("User", UserSchema)
