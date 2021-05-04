const db = require("../utils/db");


exports.root = async (req, res) => {

	let user_id = req.session.user_id;

	if (!user_id) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return ;
	}

	try {

		let cols = ["details", "read", "date", "target_id"];
		let data = await db.select(cols, "notifications", ["user_id"], [user_id]);
		res.status(200).json({ "status": 200, "message": "ok", "data": data.reverse().splice(0, 10) });

	} catch (error) {

		res.status(500).json({ "status": 500, "message": "internal server error" });

	}

};

exports.read = async (req, res) => {

	let user_id = req.session.user_id;

	if (!user_id) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return ;
	}

	try {

		let data = await db.update("notifications", "read", true, "user_id", user_id);
		res.status(200).json({ "status": 200, "message": "ok" });

	} catch (error) {

		res.status(500).json({ "status": 500, "message": "internal server error" });

	}

};
