const {Router} =require('express')
const router = Router()

const {verProductos,crearProductos,editarProducto,eliminarProductos}= require('../controllers/Productos.js')

router.get('/verProductos',verProductos)
router.post('/post',crearProductos)
router.put('/put/:Id_producto',editarProducto)
router.put('/delete/:Id_producto',eliminarProductos)

module.exports = router