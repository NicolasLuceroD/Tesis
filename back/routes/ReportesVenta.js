const Router = require('express')
const router = Router()


const {verTotalVendido,verTotalVendidoClientes,verTotalVendidoMetodos} = require('../controllers/ReporteVenta')

router.get('/verTotalVendido',verTotalVendido)
router.get('/verTotalVendidoClientes',verTotalVendidoClientes)
router.get('/verTotalVendidoMetodos',verTotalVendidoMetodos)


module.exports = router