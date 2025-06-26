const {Router}=require('express')
const router = Router()

const {verMetodoPago, crearMetodo, editarMetodo, eliminarMetodo} = require ('../controllers/MetodoPago')

router.get('/verMetodoPago', verMetodoPago)
router.post('/post', crearMetodo)
router.put('/put/:Id_metodoPago',editarMetodo)
router.put('/delete/:Id_metodoPago', eliminarMetodo)

module.exports = router