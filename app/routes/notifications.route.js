const router = require("express").Router();
const notifications_controller = require("../controllers/notifications.controller");

router.post("/"		, notifications_controller.root);
router.post("/read"	, notifications_controller.read);

module.exports = router;
