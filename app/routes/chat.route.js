const router = require("express").Router();
const chat_controller = require("../controllers/chat.controller");

router.post("/conversations"	, chat_controller.conversations);
router.post("/message"			, chat_controller.message);
router.post("/:user_id"			, chat_controller.root);

module.exports = router;
