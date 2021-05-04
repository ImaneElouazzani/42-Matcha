const io = require("socket.io-client")("http://127.0.0.1:3000");

const db = require("../utils/db");
const check = require("../utils/check");
const score = require("../utils/score");
const chat = require("../utils/chat");

exports.like = async (req, res) => {

	let user_id = req.session.user_id;
	let target_id = req.body.target_id;

	if (!user_id || !target_id) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return;
	}

	try {

		let check_entry_exists = await check.entry_exists("likes", user_id, target_id);
		let check_match_exists = await check.entry_exists("likes", target_id, user_id) && check_entry_exists ? true : false;
		let check_user_id = await check.user_id(target_id);
		let check_user_images = await db.select(["id"], "images", ["user_id"], [user_id]);

		if (!check_user_id.length || user_id == target_id) {
			res.status(400).json({ "status": 400, "message": "bad parameters" });
		} else if (check_entry_exists === true) {
			await db.delete("likes", ["user_id", "target_id"], [user_id, target_id]);
			res.status(200).json({ "status": 200, "message": "user unliked" });
			if (check_match_exists) {
				await db.insert("notifications", ["user_id", "target_id", "details"],
					[target_id, user_id, "A match has unliked you..."]);
				io.emit("notification", { "target_id": target_id });
				await db.delete("chats", ["first_user", "second_user"], [user_id, target_id]);
				await db.delete("chats", ["first_user", "second_user"], [target_id, user_id]);
			}
			score.update(target_id);
		} else {
			if (!check_user_images.length) {
				res.status(400).json({ "status": 400, "message": "your profile is lacking a picture" });
				return;
			}
			check_entry_exists = await check.entry_exists("views", user_id, target_id);
			if (check_entry_exists === false && user_id != target_id) {
				await db.insert("views", ["user_id", "target_id"], [user_id, target_id]);
				await db.insert("notifications", ["user_id", "target_id", "details"],
					[target_id, user_id, "Someone visited your profile! Click here!"]);
				io.emit("notification", { "target_id": target_id });
			}
			await db.insert("likes", ["user_id", "target_id"], [user_id, target_id]);
			check_entry_exists = await check.entry_exists("likes", target_id, user_id);
			if (check_entry_exists === true) {
				await db.insert("notifications", ["user_id", "target_id", "details"],
					[user_id, target_id, "You have a new match! Click here!"]);
				await db.insert("notifications", ["user_id", "target_id", "details"],
					[target_id, user_id, "You have a new match! Click here!"]);
				await chat.create(user_id, target_id);
				io.emit("notification", { "user_id": user_id, "target_id": target_id });
			} else {
				await db.insert("notifications", ["user_id", "target_id", "details"],
					[target_id, user_id, "Someone has liked you! Click here!"]);
				io.emit("notification", { "target_id": target_id });
			}
			res.status(200).json({ "status": 200, "message": "user liked" });
			score.update(target_id);
		}

	} catch (error) {

		res.status(500).json({ "status": 500, "message": "internal server error" });

	}

};

exports.report = async (req, res) => {

	let user_id = req.session.user_id;
	let target_id = req.body.target_id;
	let reason = req.body.reason;
	let details = req.body.details;

	if (!user_id || !target_id || !reason) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return;
	}

	try {

		let check_entry_exists = await check.entry_exists("reports", user_id, target_id);
		let check_user_id = await check.user_id(target_id);

		if (!check_user_id.length) {
			res.status(400).json({ "status": 400, "message": "bad parameters" });
		} else if (check_entry_exists === true) {
			res.status(400).json({ "status": 400, "message": "user already reported" });
		} else {
			let cols = ["user_id", "target_id", "reason", "details"];
			let vals = [user_id, target_id, reason, details];
			await db.insert("reports", cols, vals);
			res.status(200).json({ "status": 200, "message": "ok" });
		}

	} catch (error) {

		res.status(500).json({ "status": 500, "message": "internal server error" });

	}

};

exports.block = async (req, res) => {

	let user_id = req.session.user_id;
	let target_id = req.body.target_id;

	if (!user_id || !target_id) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return;
	}

	try {

		let check_entry_exists = await check.entry_exists("blocks", user_id, target_id);
		let check_user_id = await check.user_id(target_id);

		if (!check_user_id.length || user_id == target_id) {
			res.status(400).json({ "status": 400, "message": "bad parameters" });
		} else if (check_entry_exists === true) {
			await db.delete("blocks", ["user_id", "target_id"], [user_id, target_id]);
			res.status(200).json({ "status": 200, "message": "user unblocked" });
		} else {
			let data = await db.insert("blocks", ["user_id", "target_id"], [user_id, target_id]);
			res.status(200).json({ "status": 200, "message": "user blocked" });
			await db.delete("chats", ["first_user", "second_user"], [user_id, target_id]);
			await db.delete("chats", ["first_user", "second_user"], [target_id, user_id]);
		}

	} catch (error) {

		res.status(500).json({ "status": 500, "message": "internal server error" });

	}

};

exports.view = async (req, res) => {

	let user_id = req.session.user_id;
	let target_id = req.body.target_id;

	if (!user_id || !target_id) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return;
	}

	try {

		let check_user_id = await check.user_id(target_id);
		if (!check_user_id.length) {
			res.status(400).json({ "status": 400, "message": "bad parameters" });
			return;
		}

		let check_entry_exists = await check.entry_exists("views", user_id, target_id);
		if (check_entry_exists === false && user_id != target_id) {
			await db.insert("views", ["user_id", "target_id"], [user_id, target_id]);
			await db.insert("notifications", ["user_id", "target_id", "details"],
				[target_id, user_id, "Someone visited your profile! Click here!"]);
			io.emit("notification", { "target_id": target_id });
		}

		res.status(200).json({ "status": 200, "message": "ok" });
		score.update(target_id);

	} catch (error) {

		res.status(500).json({ "status": 500, "message": "internal server error" });

	}

};

exports.get_location = async (req, res) => {

	let user_id = req.session.user_id;

	if (!user_id) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return;
	}

	try {

		let data = await db.select(["longitude", "latitude"], "users", ["id"], [user_id]);
		res.status(200).json({ "status": 200, "message": "ok", "data": data[0] });

	} catch (error) {

		res.status(500).json({ "status": 500, "message": "internal server error" });

	}

};

exports.get_views = async (req, res) => {

	let user_id = req.session.user_id;

	if (!user_id) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return;
	}

	try {

		let data = await db.select(["user_id", "date"], "views", ["target_id"], [user_id]);
		let rets = ["firstname", "lastname", "username"];

		for (let i = 0; i < data.length; i++) {
			let user_data = await db.select(rets, "users", ["id"], [data[i].user_id]);
			data[i].firstname = user_data[0].firstname;
			data[i].lastname = user_data[0].lastname;
			data[i].username = user_data[0].username;
		}

		res.status(200).json({ "status": 200, "message": "ok", "data": data });

	} catch (error) {

		res.status(500).json({ "status": 500, "message": "internal server error" });

	}

};

exports.get_likes = async (req, res) => {

	let user_id = req.session.user_id;

	if (!user_id) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return;
	}

	try {

		let data = await db.select(["user_id", "date"], "likes", ["target_id"], [user_id]);
		let rets = ["firstname", "lastname", "username"];

		for (let i = 0; i < data.length; i++) {
			let user_data = await db.select(rets, "users", ["id"], [data[i].user_id]);
			data[i].firstname = user_data[0].firstname;
			data[i].lastname = user_data[0].lastname;
			data[i].username = user_data[0].username;
		}

		res.status(200).json({ "status": 200, "message": "ok", "data": data });

	} catch (error) {

		res.status(500).json({ "status": 500, "message": "internal server error" });

	}

}

exports.get_interests = async (req, res) => {

	let user_id = req.session.user_id;

	if (!user_id) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return;
	}

	try {

		let data = await db.select(["interest"], "interests", ["user_id"], [user_id]);
		res.status(200).json({ "status": 200, "message": "ok", "data": data.map(o => o.interest) });

	} catch (error) {

		res.status(500).json({ "status": 500, "message": "internal server error" });

	}

};

exports.root = async (req, res) => {

	let user_id = req.session.user_id;
	let target_id = req.params.user_id;

	if (!user_id || isNaN(target_id)) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return;
	}

	try {

		let check_user_id = await check.user_id(target_id);
		if (!check_user_id.length) {
			res.status(400).json({ "status": 400, "message": "bad parameters" });
			return;
		}

		let check_relation = await check.relation(user_id, target_id);
		if (check_relation === false) {
			res.status(403).json({ "status": 403, "message": "blocked by requested user" });
			return;
		}

		let rets = ["username", "firstname", "lastname", "latitude", "gender", "bio", "longitude",
			"last_seen", "date_of_birth", "sexual_orientation", "popularity_score"];
		let data = await db.select(rets, "users", ["id"], [target_id]);
		let interests = await db.select(["interest"], "interests", ["user_id"], [target_id]);
		data[0].interests = interests.map((o) => o.interest);
		data[0].images = await db.select(["id", "image"], "images", ["user_id"], [target_id]);
		data[0].is_liked = await check.entry_exists("likes", user_id, target_id);
		data[0].is_blocked = await check.entry_exists("blocks", user_id, target_id);
		data[0].has_liked = await check.entry_exists("likes", target_id, user_id);

		res.status(200).json({ "status": 200, "message": "ok", "profile": data });

	} catch (error) {

		res.status(500).json({ "status": 500, "message": "internal server error" });

	}

};
