const {Router} = require('express')
const router= Router()

const {movimientosclientes} = require('../controllers/Credito')

router.post('/movimientosclientes/registrar', movimientosclientes)

module.exports = router