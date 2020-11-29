const express = require("express")
const fs = require("fs")


const server = express()
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

const listener = server.listen(process.env.PORT || 3000, () => {
    console.log("App is listening on port " + listener.address().port)
})
