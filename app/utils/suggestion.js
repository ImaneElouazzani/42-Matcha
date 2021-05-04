const moment = require("moment");
const db = require("./db");
const distance = require("./distance");

/*
** -------------------------------------------------------------------------- **
**	Give "filters" for suggestions query, based on user preferences.
** -------------------------------------------------------------------------- **
*/

exports.preferences = (gender, sexual_orientation) => {

	const prefs = {
		"male": {
			"bisexual": ["female", "male"],
			"homosexual": ["male"],
			"heterosexual": ["female"]
		},
		"female": {
			"bisexual": ["female", "male"],
			"homosexual": ["female"],
			"heterosexual": ["male"]
		}
	};

	return prefs[gender][sexual_orientation];

};

/*
** -------------------------------------------------------------------------- **
**	Turn common interests into a "matching percentage".
**	5 common interests and above is 100%.
** -------------------------------------------------------------------------- **
*/

const common_interests = (u_ints, target_id, interests) => {

	try {

		let t_ints = interests.filter((o) => o.user_id === target_id).map((o) => o.interest);
		let commons = u_ints.filter(u_int => t_ints.some(t_int => t_int.toLowerCase() === u_int.toLowerCase()));
		let ret = commons.length * 20;

		return ret > 100 ? 100 : ret;

	} catch (error) {

		throw new Error(error.message);
		return 0;

	}

};

/*
** -------------------------------------------------------------------------- **
**	Turn distance into a "matching percentage".
**	The smallest the distance between the two users is, the biggest the
**	percentage is.
**	Over 100km, the percentage will be 0.
** -------------------------------------------------------------------------- **
*/

const location = (u_lat, u_lon, t_lat, t_lon) => {

	let dist = distance(u_lat, u_lon, t_lat, t_lon);

	return (100 - dist) > 0 ? (100 - dist) : 0;

};

/*
** -------------------------------------------------------------------------- **
**	Turn age difference into a "matching percentage".
**	The biggest the gap between the two ages is, the smallest the percentage is.
** -------------------------------------------------------------------------- **
*/

const age = (user_dob, target_dob) => {

	let format = "YYYY-MM-DD HH:mm:ss";
	let ua = moment().diff(moment(user_dob, format), "YEARS");
	let ta = moment().diff(moment(target_dob, format), "YEARS");

	return (ua > ta ? ta : ua) * 100 / (ua > ta ? ua : ta);

};

/*
** -------------------------------------------------------------------------- **
**	Turn score difference into a "matching percentage".
**	The biggest the gap between the two scores is, the smallest the
**	percentage is.
** -------------------------------------------------------------------------- **
*/

const score = (user_score, target_score) => {

	let us = user_score;
	let ts = target_score;

	if (!us || !ts) return 0;
	return (us > ts ? ts : us) * 100 / (us > ts ? us : ts);

};

/*
** -------------------------------------------------------------------------- **
**	Compatibility is calculated based on 3 factors:
**	- (25% of the final result) interests in common
**	- (33% of the final result) location
**	- (10% of the final result) age
**	- (32% of the final result) popularity score
** -------------------------------------------------------------------------- **
*/

exports.compatibility = (user_data, target_data, interests) => {

	let ud = user_data;
	let td = target_data;

	let int_cmp = common_interests(ud.interests, td.id, interests);
	let loc_cmp = location(ud.latitude, ud.longitude, td.latitude, td.longitude);
	let age_cmp = age(ud.date_of_birth, td.date_of_birth);
	let pop_cmp = score(ud.popularity_score, td.popularity_score);

	return ((int_cmp * 0.30) + (loc_cmp * 0.35) + (age_cmp * 0.10) + (pop_cmp * 0.25));

};
