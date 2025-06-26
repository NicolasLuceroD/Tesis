const {Router}=require('express')
const router = Router()

const {verDroguerias,crearDroguerias,editarDroguerias,eliminarDroguerias}= require('../controllers/Droguerias.js')

router.get('/verDroguerias',verDroguerias)
router.post('/post',crearDroguerias)
router.put('/put/:Id_drogueria',editarDroguerias)
router.put('/delete/:Id_drogueria',eliminarDroguerias)

module.exports = router