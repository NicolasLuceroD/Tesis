const {Router}=require('express')
const router = Router()

const {verStock}= require('../controllers/Stock.js')

router.get('/verStock',verStock)



module.exports = router