const {Router}= require('express')
const router = Router()

const { registrarVenta } = require('../controllers/Venta');

router.post('/registrarVenta', registrarVenta);

module.exports = router;
