const express = require("express")
const MainRouter = require("./routes")

const server = express();

server.use(express.json())

server.use('/api', MainRouter)

server.get('/', (_, res) => {
    return res.send('Navigate to the /api route')
})


server.listen(3000)