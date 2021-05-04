const bcrypt = require("bcryptjs");
const moment = require("moment");

const db = require("./db");
const distance = require("./distance");
const validate = require("./validate");

/*
** -------------------------------------------------------------------------- **
**	Check if a `user_id` already exists.
** -------------------------------------------------------------------------- **
*/

exports.user_id = async (user_id) => {
	try {
		let data = await db.select(["id"], "users", ["id"], [user_id]);
		return data;
	} catch (error) {
		throw new Error(error.message);
		return null;
	}
}; 

/*
** -------------------------------------------------------------------------- **
**	Check if `password` matches for given `user_id` already exists.
** -------------------------------------------------------------------------- **
*/

exports.password = async (user_id, password) => {
	try {
		let data = await db.select(["password"], "users", ["id"], [user_id]);
		return bcrypt.compareSync(password, data[0].password);
	} catch (error) {
		throw new Error(error.message);
		return null;
	}
};

/*
** -------------------------------------------------------------------------- **
**	Check if a `username` is already in use.
** -------------------------------------------------------------------------- **
*/

exports.username = async (username) => {
	try {
		let data = await db.select(["username"], "users", ["username"], [username]);
		return data;
	} catch (error) {
		throw new Error(error.message);
		return null;
	}
};

/*
** -------------------------------------------------------------------------- **
**	Check if an `email` is already in use.
** -------------------------------------------------------------------------- **
*/

exports.email = async (email) => {
	try {
		let data = await db.select(["email"], "users", ["email"], [email]);
		return data;
	} catch (error) {
		throw new Error(error.message);
		return null;
	}
};

/*
** -------------------------------------------------------------------------- **
**	Check whether a `table` whith both `user_id` and `target_id` exists or not.
** -------------------------------------------------------------------------- **
*/

exports.entry_exists = async (table, user_id, target_id) => {
	try {
		let data = await db.select(null, table, ["user_id"], [user_id]);
		for (let i = 0; i < data.length; i++)
			if (data[i].target_id === Number(target_id))
				return true;
		return false;
	} catch (error) {
		throw new Error(error.message);
		return null;
	}
};

/*
** -------------------------------------------------------------------------- **
**	Check whether `user_id` has been blocked by `target_id` or not.
** -------------------------------------------------------------------------- **
*/

exports.relation = async (user_id, target_id) => {
	try {
		let data = await db.select(["target_id"], "blocks", ["user_id"], [target_id]);
		for (let i = 0; i < data.length; i++)
			if (data[i].target_id === Number(user_id))
				return false;
		return true;
	} catch (error) {		
		throw new Error(error.message);
		return null;
	}
};

/*
** -------------------------------------------------------------------------- **
**	Check whether `user_id` has already uploaded 5 images or not.
** -------------------------------------------------------------------------- **
*/

exports.images_number = async (user_id) => {
	try {
		let data = await db.select(null, "images", ["user_id"], [user_id]);
		return data.length < 5;
	} catch (error) {
		throw new Error(error.message);
		return null;
	}
};

/*
** -------------------------------------------------------------------------- **
**	Check if the given profile matches the /search query or not.
**	Query struct:
**	{
**		"distance": {
**			"min": Number,	// kilometers
**			"max": Number	// kilometers
**		},
**		"age": {
**			"min": Number,	// years
**			"max": Number	// years
**		},
**		"popularity": {
**			"min": Number,	// 0-1000
**			"max": Number,	// 0-1000
**		},
**		"interests": [ String, String, ... ]	// array of string
**	}
** -------------------------------------------------------------------------- **
*/

exports.search = (profile, query, user_data) => {
	if (query.interests !== undefined && Array.isArray(query.interests)) {
		var n = query.interests.filter(tag => profile.interests.includes(tag));
		if (n.length == 0 && query.interests.length != 0)
			return false;
	}
	if (query.age !== undefined) {
		if (query.age.min !== undefined) {
			if (moment().diff(profile.date_of_birth, "YEARS") < query.age.min)
				return false;
		}
		if (query.age.max !== undefined) {
			if (moment().diff(profile.date_of_birth, "YEARS") > query.age.max)
				return false;
		}
	}
	if (query.distance !== undefined) {
		if (query.distance.min !== undefined) {
			if (distance(profile.latitude, profile.longitude,
				user_data.latitude, user_data.longitude) < query.distance.min)
				return false;
		}
		if (query.distance.max !== undefined) {
			if (distance(profile.latitude, profile.longitude,
				user_data.latitude, user_data.longitude) > query.distance.max)
				return false;
		}
	}
	if (query.popularity !== undefined) {
		if (query.popularity.min !== undefined) {
			if (profile.popularity_score < query.popularity.min)
				return false;
		}
		if (query.popularity.max !== undefined) {
			if (profile.popularity_score > query.popularity.max)
				return false;
		}
	}
	return true;
};
