import express from "express"
import cartRouter from "./routes/cartRouter.js"
import productsRouter from "./routes/productsRouter.js"
import upload from "./config/multer.js"
import mongoose from "mongoose"
import userRouter from "./routes/userRouter.js"
import messageModel from "./models/messages.js"

import { Server } from "socket.io"
import { __dirname } from './path.js'

import { engine } from "express-handlebars"
import chatRouter from "./routes/chatRouter.js"

const app = express()
const PORT = 8080

// por acá el server
const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})

const io = new Server(server)

// Connection DB
mongoose.connect("mongodb+srv://cllinconao:myXy6WqAvNAJy3Kb@cluster0.od9skcq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(() => console.log("DB is connected"))
.catch(e => console.log(e))

// middlewares
app.use(express.json())
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')


io.on('conection', (socket) => {
    console.log("Conexion con Socket.io")

    socket.on('mensaje', async (mensaje) => {
        try {
            await messageModel.create(mensaje)
            const mensajes = await messageModel.find()
            io.emit('mensajeLogs', mensajes)
        } catch (error) {
            io.emit('mensajeLogs', error)
        }

    })
})

// por acá routes
app.use('/public', express.static(__dirname + '/public'))
app.use('/api/products', productsRouter, express.static(__dirname + '/public'))
app.use('/api/cart ', cartRouter)
app.use('/api/chat', chatRouter, express.static(__dirname + '/public'))
app.use('/api/users', userRouter)

app.post('/upload', upload.single('product'), (req, res) => {

    try {
        console.log(req.file)
        res.status(200).send("Imagen cargada")
    } catch (error) {
        res.status(500).send("Hay un error al cargar imagen")
    }

})
