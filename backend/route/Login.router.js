const express = require("express")
const app = express()
const User = require("../model/user")
const jwt = require("jsonwebtoken")
const { OAuth2Client } = require("google-auth-library")
const client = new OAuth2Client(process.env.GOOGLECLIENTID)
app.get("/getuser", (req, res) => {
    res.send("get user")
})


app.post("/adduser", (req, res) => {
    const { name, email } = req.body
    if (!name) return res.status(400).json({ mess: "name must exist" })
    if (!email) return res.status(400).json({ mess: "email must exist" })
    User.create({
        name: name,
        email: email,

    }).then((data) => {
        res.json({ data })
    }).catch((e) => {
        res.status(400).json({ mess: e })
    })
})
app.post("/searchuser", (req, res) => {
    const { searchValue } = req.body
    if (!searchValue) return res.status(400).json({ mess: "search Value must exist" })

    User.find({
        $or: [{
            name: { $regex: searchValue, $options: 'i' }
        }, {
            email: { $regex: searchValue, $options: 'i' }
        }]


    }).exec((err, data) => {
        if (err) return res.status(400).json({ mess: "something went wrong in search" })
        if (!data) return res.status(400).json({ mess: "no item found in search" })
        res.json(data)
    })
})


app.post("/google", (req, res) => {
    const { tokenId, googleId } = req.body

    client.verifyIdToken({ idToken: tokenId, audience: process.env.GOOGLECLIENTID }).then((respo) => {

        User.findOne({
            googleId: googleId
        }).exec((err, data) => {
            if (err) return res.status(400).json({ mess: "somthing Went wrong with google" })
            if (data) {
                const token = jwt.sign({ googleId: data.googleId, name: data.name, email: data.email, image: data.image, _id: data._id }, "mohi")

                res.status(200).json({ token, user: data })
            } else {
                User.create({
                    name: respo.payload.name,
                    email: respo.payload.email,
                    image: respo.payload.picture,
                    googleId: googleId,
                }, (err, data2) => {
                    if (err) return res.status(400).json({ mess: "somthing Went wrong with google2" })
                    console.log(data2);

                    const token = jwt.sign({ googleId: data2.googleId, name: data2.name, email: data2.email, image: data2.image, _id: data2._id }, "mohi")
                    res.status(200).json({ token, user: data2 })

                })
            }
        })




    }).catch((e) => {
        res.status(400).json({ mess: e })
    })
})
app.post('/google/success', (req, res) => {
    const { token } = req.body
    jwt.verify(token, "mohi", (err, data) => {
        if (err) res.status(400).json({ mess: err.message })
        if (!data) res.status(400).json({ mess: "you must login again" })
        res.status(200).json({ user: data })
    })
})

module.exports = app