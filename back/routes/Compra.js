const {Router}= require('express')
const router = Router()

const {registrarCompraYLote} = require('../controllers/Compra')

router.post('/post', registrarCompraYLote)

module.exports = router