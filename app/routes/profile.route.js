const router = require("express").Router();
const profile_controller = require("../controllers/profile.controller");

router.post("/like"				, profile_controller.like);
router.post("/report"			, profile_controller.report);
router.post("/block"			, profile_controller.block);
router.post("/view"				, profile_controller.view);
router.post("/get_location"		, profile_controller.get_location);
router.post("/get_views"		, profile_controller.get_views);
router.post("/get_likes"		, profile_controller.get_likes);
router.post("/get_interests"	, profile_controller.get_interests);
router.post("/:user_id"			, profile_controller.root);

module.exports = router;
