const {Router}= require('express')
const router = Router()

const {registrarDetalleCompra, verDetalleCompraCompletoAgrupado,verTotalCompras} = require('../controllers/DetalleCompra')

router.get('/verDetalleCompraCompleto', verDetalleCompraCompletoAgrupado)
router.get('/verTotalCompras',verTotalCompras)
router.post('/post', registrarDetalleCompra)


module.exports = router