const bcrypt = require("bcryptjs");
const axios = require("axios");

const db = require("../utils/db");
const validate = require("../utils/validate");
const check = require("../utils/check");
const mail = require("../utils/mail");

exports.root = async (req, res) => {

	let user_id = req.session.user_id;
	let username = req.body.username;
	let firstname = req.body.firstname;
	let lastname = req.body.lastname;
	let gender = req.body.gender;
	let date_of_birth = req.body.date_of_birth;
	let bio = req.body.bio;
	let sexual_orientation = req.body.sexual_orientation;

	if (!user_id) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return ;
	}	

	try {

		let cols = [ "username", "firstname", "lastname", "gender",
					 "date_of_birth", "bio", "sexual_orientation" ];
		let vals = [
			validate.username(username) ? username : undefined,
			validate.firstname(firstname) ? firstname : undefined,
			validate.lastname(lastname) ? lastname : undefined,
			validate.gender(gender) ? gender : undefined,
			validate.date_of_birth(date_of_birth) ? date_of_birth : undefined,
			validate.bio(bio) ? bio : undefined,
			validate.sexual_orientation(sexual_orientation) ? sexual_orientation : undefined
		];

		for (let i = 0; i < vals.length; i++) {
			if (vals[i] !== undefined)
				await db.update("users", cols[i], vals[i], "id", user_id);
		}

		res.status(200).json({ "status": 200, "message": "ok" });

	} catch (error) {

		res.status(500).json({ "status": 500, "message": "internal server error" });

	}

};

exports.interests = async (req, res) => {

	let user_id = req.session.user_id;
	let interests = req.body.interests;

	if (!user_id || !interests) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return ;
	}


	interests = interests.match(/#[a-zA-Z0-9]+/g);

	try {

		await db.delete("interests", ["user_id"], [user_id]);

		interests = [...new Set(interests)]; // remove duplicates
		for (let i = 0; i < interests.length; i++) {
			if (validate.interest(interests[i]) === true)
				await db.insert("interests", ["user_id", "interest"], [user_id, interests[i]]);
		}

		res.status(200).json({ "status": 200, "message": "ok" });

	} catch (error) {

		res.status(500).json({ "status": 500, "message": "internal server error" });

	}

};

exports.password = async (req, res) => {

	let user_id = req.session.user_id;
	let old_password = req.body.old_password;
	let new_password = req.body.new_password;

	if (!user_id || !old_password || !new_password) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return ;
	}

	try {

		let check_user_pass = await check.password(user_id, old_password);

		if (check_user_pass === false) {
			res.status(400).json({ "status": 400, "message": "wrong password" });
		} else if (!validate.password(new_password)) {
			res.status(400).json({ "status": 400, "message": "invalid password" });
		} else {
			let hash = bcrypt.hashSync(new_password, 10);
			await db.update("users", "password", hash, "id", user_id);
			res.status(200).json({ "status": 200, "message": "ok" });
		}

	} catch (error) {

		res.status(500).json({ "status": 500, "message": "internal server error" });

	}

};

exports.email = async (req, res) => {

	let user_id = req.session.user_id;
	let new_email = req.body.new_email;

	if (!user_id || !new_email) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return ;
	}

	try {

		if (!validate.email(new_email)) {
			res.status(400).json({ "status": 400, "message": "invalid e-mail address" });
			return ;
		}

		let check_user_mail = await check.email(new_email);
		if (check_user_mail.length !== 0) {
			res.status(400).json({ "status": 400, "message": "account with given details exists" });
			return;
		}

		await db.update("users", "email", new_email, "id", user_id);
		await db.update("users", "status", false, "id", user_id);
		// make account 'not valid' again until new email has been validated
		mail.confirm_account(new_email);

		res.status(200).json({ "status": 200, "message": "ok" });

	} catch (error) {

		res.status(500).json({ "status": 500, "message": "internal server error" });

	}

};

exports.location = async (req, res) => {

	let user_id = req.session.user_id;

	if (!user_id) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return ;
	}

	try {

		let latitude, longitude;
		if (req.body.latitude && req.body.longitude) {
			latitude = req.body.latitude;
			longitude = req.body.longitude;
		} else {
			let res = await axios.get(`http://ip-api.com/json/${req.ip}`);
			latitude = res.data.lat;
			longitude = res.data.lon;
		}

		await db.update("users", "latitude", latitude, "id", user_id);
		await db.update("users", "longitude", longitude, "id", user_id);

		res.status(200).json({ "status": 200, "message": "ok" });

	} catch (error) {

		res.status(500).json({ "status": 500, "message": "internal server error" });
	
	}

};
