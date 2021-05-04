const db = require("./db");

exports.create = async (user_id, target_id) => {

	try {

		let user_data = await db.select(null, "users", ["id"], [user_id]);
		let target_data = await db.select(null, "users", ["id"], [target_id]);;

		let user_name = user_data[0].username;
		let target_name = target_data[0].username;

		let values = [user_id, target_id, user_name, target_name];
		let cols = ["first_user", "second_user", "first_user_name", "second_user_name"];

		await db.insert("chats", cols, values);

	} catch (error) {

	
	}

};
