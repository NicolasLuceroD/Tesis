const {Router}=require('express')
const router = Router()

const {registrarAperturaCaja,totalVentasDia,registrarCierreCaja, desgloseVenta, montoInicialApertura} = require('../controllers/Caja')

router.get('/totalVentasDia/:idUsuario/:idApertura',totalVentasDia)
router.get('/desgloseVenta/:idUsuario/:idApertura',desgloseVenta)
router.get('/montoinicialapertura/:idApertura',montoInicialApertura)
router.post('/registrarAperturaCaja',registrarAperturaCaja)
router.post('/registrarCierreCaja',registrarCierreCaja)

module.exports = router