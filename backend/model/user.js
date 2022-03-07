const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        trim: true,

    },
    email: {
        type: String,
        trim: true,
        required: true,

    },
    image: {
        type: String,
        default: "https://www.pngfind.com/pngs/m/676-6764065_default-profile-picture-transparent-hd-png-download.png"
    }
}, { timestamps: true })

module.exports = mongoose.model("User", UserSchema)