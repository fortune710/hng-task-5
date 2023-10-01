const express = require("express")
const MainRouter = require("./routes")

const server = express();

server.use(express.json())

server.use('/api', MainRouter)


server.listen(3000)