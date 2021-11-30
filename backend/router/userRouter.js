const Route = require('express');
const {login , register} = require('../controllers/UserController')

const router = new Route()

router.post("/login", login)

router.post("/register", register)

module.exports = router
