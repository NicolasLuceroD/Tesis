const { Router } = require('express');
const router = Router();

const {registrarLote} = require('../controllers/Lotes')

router.post('/post', registrarLote)

module.exports = router