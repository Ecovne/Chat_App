const express = require("express")
const app = express()
const Room = require("../model/Rooms")



app.post("/create", async (req, res) => {

    const { me, user2 } = req.body
    if (!me) return res.status(400).json({ mess: "user1 room is require" })
    if (!user2) return res.status(400).json({ mess: "user2 room is require" })
    if (me === user2) return res.status(400).json({ mess: "you cant create room with yourself" })
    Room.find({ userinroom: { $all: [me, user2] } }).populate("userinroom").then(async (data) => {
        if (data.length > 0) return res.status(400).json({ mess: "room is exist" })
        Room.create({
            userinroom: [me, user2]
        }).then(async (data) => {
            const data11 = await data.populate('userinroom');
            res.json(data11)
        })
    })

})
app.post("/find", (req, res) => {
    const { id } = req.body

    if (!id) return res.status(400).json({ mess: "user exist must exist" })
    Room.find({ userinroom: { $elemMatch: { $eq: id } } }).populate("userinroom").exec((err, data) => {
        if (err) return res.status(400).json({ mess: "somtheing went wrong" })
        if (data.length == 0) return res.status(400).json({ mess: "no room avilable" })
        res.json(data)

    })

})

module.exports = app