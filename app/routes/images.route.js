const router = require("express").Router();
const images_controller = require("../controllers/images.controller");

router.get("/:file_name"	, images_controller.root);
router.post("/upload"		, images_controller.upload);
router.post("/delete"		, images_controller.delete);

module.exports = router;
