const express = require("express")
const MainRouter = require("./routes")

const server = express();

server.use(express.json())

server.use('/api', MainRouter)

server.use("/uploads", express.static("uploads"));

server.get('/', (_, res) => {
    return res.send('Navigate to the /api route')
})


server.listen(3000)