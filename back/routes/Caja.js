const {Router}=require('express')
const router = Router()

const {registrarAperturaCaja,totalVentasDia,registrarCierreCaja} = require('../controllers/Caja')

router.get('/totalVentasDia/:idUsuario/:idApertura',totalVentasDia)
router.post('/registrarAperturaCaja',registrarAperturaCaja)
router.post('/registrarCierreCaja',registrarCierreCaja)

module.exports = router