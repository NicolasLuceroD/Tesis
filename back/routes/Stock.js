const {Router}=require('express')
const router = Router()

const {verStock, verTotalProductoCategorias, verProductosVencidos}= require('../controllers/Stock.js')

router.get('/verStock',verStock)
router.get('/verTotalProductoCategorias', verTotalProductoCategorias)
router.get('/verProductosVencidos', verProductosVencidos)



module.exports = router