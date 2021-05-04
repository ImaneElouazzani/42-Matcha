const db = require("./db");

exports.update = async (user_id) => {

	try {

		let nb_likes = await db.select(null, "likes", ["target_id"], [user_id]);
		nb_likes = nb_likes.length || 0;
		let nb_views = await db.select(null, "views", ["target_id"], [user_id]);
		nb_views = nb_views.length || 0;
		let nb_users = await db.select(null, "users", [], []);
		nb_users = nb_users.length || 0;

		let ratio_like_views = (nb_likes / nb_views) * 500;
		if (ratio_like_views === Infinity || !ratio_like_views)
			ratio_like_views = 0;

		let ratio_view_users = (nb_views / nb_users) * 500;
		if (ratio_view_users === Infinity || !ratio_view_users)
			ratio_view_users = 0;

		const popularity_score = Math.round(ratio_like_views + ratio_view_users) || 0;
		await db.update("users", "popularity_score", popularity_score, "id", user_id);

		return popularity_score >= 0 && popularity_score <= 1000 ? popularity_score : -1;

	} catch (error) {

		throw new Error(error.message);
		return null;

	}

};
