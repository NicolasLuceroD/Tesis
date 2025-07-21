const Router = require('express')
const router = Router()


const {verTotalDrogueria,verMontoTotalComprado,verTopProductosComprados,verPromedioGasto} = require('../controllers/Reportes')

router.get('/verTotalDrogueria', verTotalDrogueria)
router.get('/verMontoTotalComprado', verMontoTotalComprado)
router.get('/verTopProductosComprados', verTopProductosComprados)
router.get('/verPromedioGasto', verPromedioGasto)


module.exports = router