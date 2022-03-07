const mongoose = require("mongoose")

const RoomsSchema = new mongoose.Schema({


    userinroom: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        trim: true,
        required: true


    }]

}, { timestamps: true })

module.exports = mongoose.model("Room", RoomsSchema)