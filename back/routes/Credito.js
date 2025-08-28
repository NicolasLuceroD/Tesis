const {Router} = require('express')
const router= Router()

const {movimientosclientes, verElCreditoCompleto} = require('../controllers/Credito')

router.get('/verElCreditoCompleto/:Id_cliente',verElCreditoCompleto)
router.post('/movimientosclientes/registrar', movimientosclientes)

module.exports = router