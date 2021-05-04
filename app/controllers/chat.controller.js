const faker = require("faker");
const io = require("socket.io-client")("http://127.0.0.1:3000");

const check = require("../utils/check");
const db = require("../utils/db");

exports.conversations = async (req, res) => {

	let user_id = req.session.user_id;

	if (!user_id) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return;
	}

	try {

		let c_u_id = await check.user_id(user_id);
		if (!c_u_id.length) {
			res.status(400).json({ "status": 400, "message": "you are not connected" });
			return;
		}

		let rets = ["id", "first_user", "second_user", "first_user_name", "second_user_name", "date"];
		let data1 = await db.select(rets, "chats", ["first_user"], [user_id]);
		let data2 = await db.select(rets, "chats", ["second_user"], [user_id]);
		let data = data1.concat(data2);

		res.status(200).json({ "status": 200, "message": "ok", "conversations": data });

	} catch (error) {

		res.status(500).json({ "status": 500, "message": "internal server error (1)" });

	}

};

exports.message = async (req, res) => {

	let user_id = req.session.user_id;
	let target_id = req.body.target_id;
	let message = req.body.message;
	let chat_id = req.body.chat_id;

	if (!user_id || !message || !chat_id) {
		res.status(400).json({ "status": 400, "message": "Missing parameters" });
		return;
	}

	try {

		if (!chat_id) {
			res.status(400).json({ "status": 400, "message": "you did not match with this person" });
			return;
		}

		let v_f = [user_id, chat_id, message];
		let c_f = ["user_id", "chat_id", "message"];
		await db.insert("messages", c_f, v_f);
		io.emit("message", { "user_id": user_id, "target_id": target_id });
		await db.insert("notifications", ["user_id", "target_id", "details"],
			[target_id, user_id, "You have a new message !"]);
		io.emit("notification", { "target_id": target_id });

		res.status(200).json({ "status": 200, "message": "ok" });

	} catch (error) {

		res.status(500).json({ "status": 500, "message": "internal server error (4)" });

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


		let col = ["first_user", "second_user"];
		let res1 = [user_id, target_id];
		let chat = await db.select(["id"], "chats", col, res1);

		let col2 = ["first_user", "second_user"];
		let res2 = [target_id, user_id];
		let chat2 = await db.select(["id"], "chats", col2, res2);

		if (!chat.length && chat2.length) {
			let cols = ["user_id", "message", "date"];
			let all_chat = await db.select(cols, "messages", ["chat_id"], [chat2[0].id]);
			res.status(200).json({ "status": 200, "message": "ok", "messages": all_chat });

		} else if (chat.length) {
			let cols = ["user_id", "message", "date"];
			let all_chat = await db.select(cols, "messages", ["chat_id"], [chat[0].id]);
			res.status(200).json({ "status": 200, "message": "ok", "messages": all_chat });

		}

	} catch (error) {

		res.status(500).json({ "status": 500, "message": "internal server error (3)" });

	}
};
