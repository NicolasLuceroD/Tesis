const {Router}=require('express')
const router = Router()

const {verCategoria,crearCategoria,editarCategoria,eliminarCategoria}= require('../controllers/Categoria.js')

router.get('/verCategoria',verCategoria)
router.post('/post',crearCategoria)
router.put('/put/:Id_categoria',editarCategoria)
router.put('/delete/:Id_categoria',eliminarCategoria)

module.exports = router