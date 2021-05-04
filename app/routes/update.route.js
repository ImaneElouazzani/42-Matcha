const router = require("express").Router();
const update_controller = require("../controllers/update.controller");

router.post("/"				, update_controller.root);
router.post("/interests"	, update_controller.interests);
router.post("/password"		, update_controller.password);
router.post("/email"		, update_controller.email);
router.post("/location"		, update_controller.location);

module.exports = router;
