import express from "express"
import cartRouter from "./routes/cartRouter.js"
import productsRouter from "./routes/productsRouter.js"
import upload from "./config/multer.js"

import { Server } from "socket.io"
import { __dirname } from './path.js'
import { CartManager } from "./config/cartManager.js"
import { engine } from "express-handlebars"
import chatRouter from "./routes/chatRouter.js"

const app = express()
const PORT = 8080

// por acá el server
const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})

const io = new Server(server)

// middlewares
app.use(express.json())
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')

const mensajes = []
io.on('conection', (socket) => {
    console.log("Conexion con Socket.io")

    socket.on('mensaje', info => {

        console.log(info)
        mensajes.push(info)
        io.emit('mensajeLogs', mensajes)
    })
})

// por acá routes
app.use('/public', express.static(__dirname + '/public'))
app.use('/api/products', productsRouter, express.static(__dirname + '/public'))
app.use('/api/carts ', cartRouter)
app.use('/api/chat', chatRouter, express.static(__dirname + '/public'))

app.post('/upload', upload.single('product'), (req, res) => {

    try {
        console.log(req.file)
        res.status(200).send("Imagen cargada")
    } catch (error) {
        res.status(500).send("Hay un error al cargar imagen")
    }

})
