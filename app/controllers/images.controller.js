const crypto = require("crypto");
const fs = require("fs");

const db = require("../utils/db");
const validate = require("../utils/validate");
const check = require("../utils/check");
const config = require("../config");

exports.root = (req, res) => {

	let user_id = req.session.user_id;
	let file_name = req.params.file_name;

	if (!user_id || !file_name) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return;
	}

	res.sendFile(`${config.path}/images/${file_name}`, (error) => {
		if (error) {
			res.status(404).json({ "status": 404, "message": "Not Found" });
		}
	});

};

exports.upload = async (req, res) => {

	let user_id = req.session.user_id;
	let image = req.body.image;

	if (!user_id || !image) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return;
	}

	try {

		let check_images_number = await check.images_number(user_id);
		if (check_images_number === false) {
			res.status(400).json({ "status": 400, "message": "cannot upload more images" });
			return;
		}

		if (validate.image(image) !== true) {
			res.status(400).json({ "status": 400, "message": "not a valid image file" });
			return;
		}

		let random_name = "uu-" + crypto.randomBytes(16).toString("hex");
		image = image.replace(/^data:image\/\w+;base64,/, "");
		fs.writeFileSync(`./images/${random_name}`, Buffer.from(image, "base64"));
		await db.insert("images", ["user_id", "image"], [user_id, `${config.host}:${config.ports.server}/images/${random_name}`]);

		res.status(200).json({ "status": 200, "message": "ok" });

	} catch (error) {
		res.status(500).json({ "status": 500, "message": "internal server error" });
	}
};

exports.delete = async (req, res) => {

	let user_id = req.session.user_id;
	let image_id = req.body.image_id;

	if (!user_id || !image_id) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return;
	}

	try {

		await db.delete("images", ["id"], [image_id]);
		res.status(200).json({ "status": 200, "message": "ok" });

	} catch (error) {

		res.status(500).json({ "status": 500, "message": "internal server error" });

	}

};
