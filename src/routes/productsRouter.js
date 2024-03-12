import { Router } from "express";
import { ProductManager } from "../config/ProductManager.js";

const productManager = new ProductManager('./src/data/products.json')
const productsRouter = Router()

productsRouter.get('/', async (req, res) => {
    try {
        const { limit } = req.query
        const prods = await productManager.getProducts()
        let limite = parseInt(limit)
        if (!limite)
            limite = prods.length
        const prodsLimit = prods.slice(0, limite)
        res.status(200).render('templates/home',{
            mostrarProductos: true,
            productos: prods,
            css: 'home.css'
        })

    } catch (error) {
        res.status(500).render('templates/error',{
            error: error,
        })
    }
})


productsRouter.get('/:pid', async (req, res) => {

    try {
        const idProducto = req.params.pid
        const prod = await productManager.getProductById(idProducto)

        if (prod) {
            res.status(200).send(prod)
        } else {
            res.status(400).send("Producto no existe")
        }
    } catch (error) {
        res.status(500).send(`Error interno del servidor al consultar producto: ${error}`)
    }
})

productsRouter.post('/', async (req, res) => {

    try {
        const product = req.body
        console.log(product)
        const mensaje = await productManager.addProduct(product)
        if (mensaje == "Producto creado correctamente")
            res.status(200).send(mensaje)
        else
            res.status(400).send(mensaje)

    } catch (error) {
        res.status(500).send(`Error interno del servidor al crear cliente: ${error}`)
    }
})

productsRouter.put('/:pid', async (req, res) => {

    try {
        const idProducto = req.params.pid
        const updateProduct = req.body
        const mensaje = await productManager.updateProduct(idProducto, updateProduct)

        if (mensaje == "Producto actualizado correctamente") {
            res.status(200).send(mensaje)
        } else {
            res.status(400).send(mensaje)
        }
    } catch (error) {
        res.status(500).send(`Error interno del servidor al actualizar producto: ${error}`)
    }
})

productsRouter.delete('/:pid', async (req, res) => {

    try {
        const idProducto = req.params.pid
        const mensaje = await productManager.deleteProduct(idProducto)

        if (mensaje == "Producto eliminado correctamente") {
            res.status(200).send(mensaje)
        } else {
            res.status(400).send(mensaje)
        }
    } catch (error) {
        res.status(500).send(`Error interno del servidor al eliminar producto: ${error}`)
    }
})

export default productsRouter