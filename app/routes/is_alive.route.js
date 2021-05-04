const router = require("express").Router();
const is_alive_controller = require("../controllers/is_alive.controller");

router.post("/", is_alive_controller.is_alive);

module.exports = router;
