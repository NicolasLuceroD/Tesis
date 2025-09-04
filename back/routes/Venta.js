const {Router}= require('express')
const router = Router()

const { registrarVenta, actualizarFaltaPagar } = require('../controllers/Venta');

router.post('/registrarVenta', registrarVenta);
router.put('/actualizarFaltaPagar/:id', actualizarFaltaPagar )

module.exports = router;
