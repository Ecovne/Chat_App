const express = require("express")
const app = express()
const Message = require("../model/message")


app.post("/add", (req, res) => {
    const { roomid, message, usersendid } = req.body
    if (!roomid) return res.status(400).json({ mess: "room id require" })
    if (!message) return res.status(400).json({ mess: "message require" })
    if (!usersendid) return res.status(400).json({ mess: "userid require" })
    Message.create({
        roomId: roomid,
        messageContent: {
            usersend: usersendid,
            messageContent: message
        }
    }, async (err, data) => {
        if (err) return res.status(400).json({ mess: "somthing went wrong" })
        const data1 = await data.populate("messageContent.usersend")
        res.json(data1)
    })


})
app.get("/get/:roomid", (req, res) => {
    const { roomid } = req.params
    Message.find({ roomId: roomid }).populate("messageContent.usersend").then((data) => {
        res.json(data)
    })
})

module.exports = app