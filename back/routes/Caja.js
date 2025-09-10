const {Router}=require('express')
const router = Router()

const {registrarAperturaCaja,totalVentasDia} = require('../controllers/Caja')

router.post('/registrarAperturaCaja',registrarAperturaCaja)
router.get('/totalVentasDia/:idUsuario',totalVentasDia)

module.exports = router