const router = require("express").Router();
const suggestions_controller = require("../controllers/suggestions.controller");

router.post("/"	, suggestions_controller.root);

module.exports = router;
