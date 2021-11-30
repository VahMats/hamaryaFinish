const Route = require('express');
const UserRoutes = require('./userRouter')
const AdminRoutes = require('./adminRouter')

const router = new Route();

router.use("/user", UserRoutes)

router.use("/admin", AdminRoutes)

module.exports = router
