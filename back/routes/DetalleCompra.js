const {Router}= require('express')
const router = Router()

const {registrarDetalleCompra, verDetalleCompraCompletoAgrupado} = require('../controllers/DetalleCompra')

router.post('/post', registrarDetalleCompra)
router.get('/verDetalleCompraCompleto', verDetalleCompraCompletoAgrupado)


module.exports = router