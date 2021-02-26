const mongoose = require("mongoose")
const Schema = mongoose.Schema


const KeeperAdSchema = new Schema ({
    description: {
        type: String,
        required: true,
        min: 4,
        max: 255
    },
    title:{
        type:String,
        required:true,
        min:2,
        max:255
    },
    animalType: {
        type: String,
        required: true,
        min: 1,
        max: 255
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    zipCode: {
        type: String,
        required: true,
        max: 10
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    start:{
        type:String,
        required:true
    },
    end:{
        type:String,
        required:true,
    },

},{
    timestamps:true
})

module.exports = mongoose.model("KeeperAds",KeeperAdSchema)
