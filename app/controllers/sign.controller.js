const bcrypt = require("bcryptjs");

const db = require("../utils/db");
const validate = require("../utils/validate");
const check = require("../utils/check");
const mail = require("../utils/mail");

exports.up = async (req, res) => {

	let email = req.body.email;
	let username = req.body.username;
	let password = req.body.password;
	let firstname = req.body.firstname;
	let lastname = req.body.lastname;

	if (!email || !username || !password || !firstname || !lastname) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return ;
	}

	try {

		if (!validate.email(email)) {
			res.status(400).json({ "status": 400, "message": "invalid e-mail address" });
			return ;
		}

		if (!validate.username(username)) {
			res.status(400).json({ "status": 400, "message": "invalid username" });
			return ;
		}

		if (!validate.password(password)) {
			res.status(400).json({ "status": 400, "message": "invalid password" });
			return ;
		}

		if (!validate.firstname(firstname) || !validate.lastname(lastname)) {
			res.status(400).json({ "status": 400, "message": "invalid firstname/lastname" });
			return ;
		}

		let check_username = await check.username(username);
		let check_email = await check.email(email);
		if (check_username && check_username.length || check_email && check_email.length) {
			res.status(400).json({ "status": 400, "message": "account with given details exists" });
			return;
		}

		let hash = bcrypt.hashSync(password, 10);
		let cols = ["email", "username", "password", "firstname", "lastname"];
		let vals = [email, username, hash, firstname, lastname];
		await db.insert("users", cols, vals);

		mail.confirm_account(email);

		res.status(200).json({ "status": 200, "message": "ok" });

	} catch (error) {

		res.status(500).json({ "status": 500, "message": "internal server error" });

	}

};

exports.in = async (req, res) => {

	let username = req.body.username;
	let password = req.body.password;

	if (!username || !password) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return ;
	}

	if (req.session.user_id) {
		res.status(400).json({ "status": 400, "message": "already signed in" });
		return ;
	}

	try {

		let data = await db.select(["id", "status"], "users", ["username"], [username]);
		if (!data || !data.length || !data[0].id) {
			res.status(400).json({ "status": 400, "message": "incorrect username" });
			return ;
		} else if (data[0].status === 0) {
			res.status(400).json({ "status": 400, "message": "e-mail not confirmed" });
			return ;
		}

		let check_password = await check.password(data[0].id, password);
		if (check_password === false) {
			res.status(400).json({ "status": 400, "message": "incorrect password" });
			return ;
		}

		req.session.user_id = data[0].id;
		res.status(200).json({ "status": 200, "message": "ok", "data": req.session.user_id });

	} catch (error) {

		res.status(500).json({ "status": 500, "message": "internal server error" });

	}

};

exports.out = (req, res) => {

	if (!req.session.user_id) {
		res.status(400).json({ "status": 400, "message": "not logged in" });
		return ;
	}

	req.session.user_id = null;
	res.status(200).json({ "status": 200, "message": "ok" });

};
