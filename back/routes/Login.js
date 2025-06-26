const { Router } = require('express');
const router = Router();

const {login} = require('../controllers/Login')

router.post("/post", login)


module.exports = router