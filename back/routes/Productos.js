const {Router} =require('express')
const router = Router()

const {verProductos,crearProductos,editarProducto,eliminarProductos,productosConStock}= require('../controllers/Productos.js')

router.get('/verProductos',verProductos)
router.get('/productosConStock',productosConStock)
router.post('/post',crearProductos)
router.put('/put/:Id_producto',editarProducto)
router.put('/delete/:Id_producto',eliminarProductos)

module.exports = router