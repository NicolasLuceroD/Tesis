const {Router}= require('express')
const router = Router()

const {verDetalleVentaCompletoAgrupado,verTotalVentasXDia} = require('../controllers/DetalleVenta')

router.get('/verDetalleVentaCompletoAgrupado', verDetalleVentaCompletoAgrupado)
// router.get('/verTotalVentasXDia',verTotalVentasXDia)


module.exports = router