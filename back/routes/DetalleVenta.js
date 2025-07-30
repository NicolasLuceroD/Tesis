const {Router}= require('express')
const router = Router()

const {verDetalleVentaCompletoAgrupado} = require('../controllers/DetalleVenta')

router.get('/verDetalleVentaCompletoAgrupado', verDetalleVentaCompletoAgrupado)


module.exports = router