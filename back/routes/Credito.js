const {Router} = require('express')
const router= Router()

const {movimientosclientes, verElCreditoCompleto,registrarPago,verClientesConCredito} = require('../controllers/Credito')

router.get('/verElCreditoCompleto/:Id_cliente',verElCreditoCompleto)
router.get('/verClientesConCredito', verClientesConCredito)
router.post('/movimientosclientes/registrar', movimientosclientes)
router.post('/registrarPago/registrar',registrarPago)

module.exports = router