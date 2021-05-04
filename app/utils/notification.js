const db = require("./db");

/*
** -------------------------------------------------------------------------- **
**	Send a notification to `user_id` containing `details`.
** -------------------------------------------------------------------------- **
*/

exports.send = async (user_id, details) => {
	try {
		let data = await db.insert("notifications", ["user_id", "details"], [user_id, details]);
		return data;
	} catch (error) {
		return null;
	}
};
