const router = require("express").Router();
const sign_controller = require("../controllers/sign.controller");

router.post("/up"	, sign_controller.up);
router.post("/in"	, sign_controller.in);
router.post("/out"	, sign_controller.out);

module.exports = router;
