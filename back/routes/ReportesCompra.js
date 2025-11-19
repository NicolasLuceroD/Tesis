const Router = require('express')
const router = Router()


const {verTotalDrogueria,verMontoTotalComprado,verTopProductosComprados,verPromedioGasto, verPrecioCostoPromedio} = require('../controllers/ReportesCompra')

router.get('/verTotalDrogueria', verTotalDrogueria)
router.get('/verMontoTotalComprado', verMontoTotalComprado)
router.get('/verTopProductosComprados', verTopProductosComprados)
router.get('/verPromedioGasto', verPromedioGasto)
router.get('/verPrecioCostoPromedio',verPrecioCostoPromedio)


module.exports = router