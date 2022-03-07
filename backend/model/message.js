const mongoose = require("mongoose")

const MessageSchema = new mongoose.Schema({

    roomId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room", 
        trim: true,
        required: true
    },
    messageContent:
    {
        usersend: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        date: {
            type: Date,
            default: Date.now()
        },
        messageContent: {
            type: String,
        }

    }



}, { timestamps: true })

module.exports = mongoose.model("Message", MessageSchema)