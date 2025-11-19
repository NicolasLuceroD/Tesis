const Router = require('express')
const router = Router()


const {verTotalVendido, verTotalVendidoClientes, verTotalVendidoMetodos, verResumenVentas, verProductosMasVendidos, verUsosPresentacion, verGananciasPorCategorias} = require('../controllers/ReporteVenta')

router.get('/verTotalVendido',verTotalVendido)
router.get('/verTotalVendidoClientes',verTotalVendidoClientes)
router.get('/verTotalVendidoMetodos',verTotalVendidoMetodos)
router.get('/verResumenVentas',verResumenVentas)
router.get('/verProductosMasVendidos',verProductosMasVendidos)
router.get('/verUsosPresentacion',verUsosPresentacion)
router.get('/verGananciasPorCategorias',verGananciasPorCategorias)


module.exports = router