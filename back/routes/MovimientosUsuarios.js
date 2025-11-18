const {Router}=require('express')
const router = Router()

const { verMovimientosUsuarios } = require('../controllers/MovimientoUsuarios')

router.get('/verMovimientosUsuarios',verMovimientosUsuarios)

module.exports = router