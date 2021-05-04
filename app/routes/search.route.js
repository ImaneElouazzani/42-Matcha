const router = require("express").Router();
const search_controller = require("../controllers/search.controller");

router.post("/"	, search_controller.root);

module.exports = router;
