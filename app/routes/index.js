const router = require("express").Router();

router.use("/sign", require("./sign.route"));
router.use("/profile", require("./profile.route"));
router.use("/images", require("./images.route"));
router.use("/update", require("./update.route"));
router.use("/is_alive", require("./is_alive.route"));
router.use("/notifications", require("./notifications.route"));
router.use("/account", require("./account.route"));
router.use("/suggestions", require("./suggestions.route"));

router.use("/search", require("./search.route"));
router.use("/chat", require("./chat.route"));

module.exports = router;
