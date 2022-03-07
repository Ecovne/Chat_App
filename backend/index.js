const express = require("express")
const app = express()
const http = require("http")
const { Server } = require("socket.io")
const env = require("dotenv")
const cors = require("cors")
const connection = require("./connection")
const loginRouter = require("./route/Login.router")
const messageRouter = require("./route/message.route")
const roomRouter = require("./route/room")
env.config()
app.use(cors(
    {
        origin: "*",
        methods: ["GET", 'POST']
    }
))
app.use(express.json())

app.get("/", (req, res) => {
    res.send("hello world")
})
connection()

// soket





app.use("/login", loginRouter)
app.use("/message", messageRouter)
app.use("/room", roomRouter)
app.get("/", (req, res) => {
    res.send("hello ")
})

const httpserver = http.createServer(app)
const io = new Server(httpserver, {
    cors: {
        origin: "*",
        methods: ["GET", 'POST']
    }
})
io.on("connection", (socket) => {
    socket.on("join room", (roomid) => {
        socket.join(roomid)
    })
    socket.on("send message", (data) => {
        socket.to(data.roomId).emit("send back message", data)
    })

});


httpserver.listen(process.env.PORT || 5000, () => {
    console.log("server is running on port 5000");
})
