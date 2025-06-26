const {Router}=require('express')
const router = Router()
const {verClientes,crearClientes,editarClientes,eliminarCliente}= require('../controllers/Clientes.js')


//CRUD

router.get('/verClientes', verClientes)
router.post('/post', crearClientes)
router.put('/put/:Id_cliente', editarClientes)
router.put('/delete/:Id_cliente', eliminarCliente)

module.exports = router