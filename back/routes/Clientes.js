const {Router}=require('express')
const router = Router()
const {verClientes,crearClientes,editarClientes,eliminarCliente, aumentarCredito}= require('../controllers/Clientes.js')


//CRUD
router.get('/verClientes', verClientes)
router.post('/post', crearClientes)
router.put('/put/:Id_cliente', editarClientes)
router.put('/delete/:Id_cliente', eliminarCliente)

//PARA CREDITOS
router.put('/aumentarCredito', aumentarCredito)

module.exports = router