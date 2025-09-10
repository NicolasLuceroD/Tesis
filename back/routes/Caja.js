const {Router}=require('express')
const router = Router()

const {registrarAperturaCaja} = require('../controllers/Caja')

router.post('/registrarAperturaCaja',registrarAperturaCaja)

module.exports = router