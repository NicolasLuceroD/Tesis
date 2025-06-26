const {Router}=require('express')
const router = Router()

const {verUsuarios,crearUsuarios,editarUsuarios,eliminarUsuarios, verUsuariosBaja, altaUsuario} = require('../controllers/Usuarios.js')



router.get('/verUsuarios',verUsuarios)
router.get('/verUsuariosBaja', verUsuariosBaja)
router.post('/post',crearUsuarios)
router.put('/put/:Id_usuario',editarUsuarios)
router.put('/delete/:Id_usuario',eliminarUsuarios)
router.put('/altausuario/:Id_usuario', altaUsuario)

module.exports = router