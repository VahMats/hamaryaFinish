const Route = require("express");
const {userAdd, userEdit, userDelete} = require('../controllers/UserListEditing')
const {teamAdd, teamEdit, teamDelete} = require("../controllers/TeamListEditing")
const router = new Route()

router.post("/add", userAdd)

router.put("/edit", userEdit)

router.put("/delete", userDelete)

router.post("/addTeam", teamAdd)

router.put("/editTeam", teamEdit)

router.put("/deleteTeam", teamDelete)

module.exports = router


