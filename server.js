const express = require("express")
const fs = require("fs")


server = express()
server.use(express.static("dist"))

server.get("/", (req, res) => {
    res.render('index.html');
})

server.get("/game", (req, res) => {
    res.render("game.html");
})

server.get("/scoreboard", (req, res) => {
    res.render("scoreboard.html");
})

server.listen(3000, () => {
    console.log("listen 3000 port")
})
