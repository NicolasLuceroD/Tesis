const Router = require('express')
const router = Router()


const {verTotalDrogueria,verMontoTotalComprado} = require('../controllers/Reportes')

router.get('/verTotalDrogueria', verTotalDrogueria)
router.get('/verMontoTotalComprado', verMontoTotalComprado)


module.exports = router