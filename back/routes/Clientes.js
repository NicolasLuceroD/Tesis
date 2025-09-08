const {Router}=require('express')
const router = Router()
const {verClientes,crearClientes,editarClientes,eliminarCliente, aumentarCredito,actualizarCredito, registrarmovimiento,verMovimientosClientes}= require('../controllers/Clientes.js')


//CRUD
router.get('/verClientes', verClientes)
router.post('/post', crearClientes)
router.put('/put/:Id_cliente', editarClientes)
router.put('/delete/:Id_cliente', eliminarCliente)


//PARA CREDITOS
router.get('/verMovimientosClientes/:Id_cliente/:fechaSeleccionada', verMovimientosClientes);
router.put('/aumentarCredito', aumentarCredito)
router.put('/actualizarCredito/:id',actualizarCredito)
router.post('/registrarmovimiento',registrarmovimiento)

module.exports = router