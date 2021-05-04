const faker = require("faker");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const axios = require("axios");
const moment = require("moment");
const db = require("./utils/db");

/* custom lists + password */
const FIRST_NAMES_BOYS		= fs.readFileSync("./config/top500-boys-name-fr-2k10.txt", "utf8").split("\n");
const FIRST_NAMES_GIRLS		= fs.readFileSync("./config/top500-girls-name-fr-2k10.txt", "utf8").split("\n");
const HOBBIES_AND_INTERESTS	= fs.readFileSync("./config/395-hobbies-and-interests.txt", "utf8").split("\n");
const PROVERBIAL_PHRASES	= fs.readFileSync("./config/proverbial-phrases.txt", "utf8").split("\n");
const PASSWORD				= bcrypt.hashSync("Test123@", 10)

/* global variables */
const API_BASE_URL = "https://uifaces.co/api";
const LIMIT = 20;

const generateImages = async (gender) => {

	try {
		let data = { "headers": { "X-API-KEY": "dea16b03471bffa4c07519dc6fe053" } };
		let response = await axios.get(`${API_BASE_URL}?gender[]=${gender}&from_age=18&limit=${LIMIT}`, data);
		let images = response.data.map((data) => data.photo);
		console.log(`% GENERATED ${images.length} '${gender}' IMAGES`);
		return images;
	} catch (error) {
		console.error(error.message);
		return null;
	}

};

const generateProfile = () => {

	let email = faker.internet.email();
	let latitude = faker.finance.amount(23.68477, 35.76727, 6);
	let longitude = faker.finance.amount(-15.95798, -1.22855, 6);
	let last_seen = faker.date.recent();
	let date_of_birth = faker.date.past(24, "2000-01-01");
	let gender = faker.random.arrayElement(["male", "female"]);
	let firstname = faker.random.arrayElement(gender === "male" ? FIRST_NAMES_BOYS : FIRST_NAMES_GIRLS);
	firstname = firstname.charAt(0).toUpperCase() + firstname.slice(1); // add upper case to first letter
	let lastname = faker.name.lastName();
	let username = `${firstname.charAt(0)}${lastname}${faker.random.number({"min": 01, "max": 95})}`.toLowerCase();
	username = username.replace(/[\W_]+/g, "_");
	let sexual_orientation = faker.random.arrayElement(["heterosexual", "homosexual", "bisexual"]);
	let bio = faker.random.arrayElement(PROVERBIAL_PHRASES);
	let popularity_score = faker.random.number({"min": 0, "max": 1000});
	let status = true;

	let values = [];
	values.push(email);
	values.push(username);
	values.push(firstname);
	values.push(lastname);
	values.push(PASSWORD);
	values.push(latitude);
	values.push(longitude);
	values.push(last_seen);
	values.push(date_of_birth);
	values.push(gender);
	values.push(sexual_orientation);
	values.push(bio);
	values.push(popularity_score);
	values.push(status);

	return values;

};

const generateInterests = (id) => {
	
	const nb = faker.random.number({ "min": 1, "max": 10 });
	const interests = [];

	for (let i = 0; i < nb; i++) {
		let int = faker.random.arrayElement(HOBBIES_AND_INTERESTS);
		interests.push(`(${id}, '${int}')`);
	}

	return interests;

};

const generateViewsAndLikes = (u_id) => {

	var like_nb = faker.random.number({ "min": 1, "max": (LIMIT / 16) });
	var view_nb = faker.random.number({ "min": like_nb, "max": (LIMIT / 8) });
	var views = [];
	var likes = [];

	for (let i = 0; i < view_nb; i++) {
		let t_id = faker.random.number({ "min": 1, "max": LIMIT });
		if (u_id != t_id && !views.some(id => id === t_id)) // prevent duplicates
			views.push(t_id);
	}
	
	var views_likes = views.slice(); // copy array
	views = views.map(t_id => `(${u_id}, ${t_id}, '${moment(faker.date.recent()).format("YYYY-MM-DD HH:mm:ss")}')`); // format for query

	for (let i = 0; i < like_nb; i++) {
		let t_id = faker.random.arrayElement(views_likes);
		if (t_id && u_id != t_id && t_id !== undefined) {
			likes.push(t_id);
			views_likes = views_likes.filter(id => id != t_id);
		}
	}

	likes = likes.map(t_id => `(${u_id}, ${t_id}, '${moment(faker.date.recent()).format("YYYY-MM-DD HH:mm:ss")}')`); // format for query
	return [views, likes];

};

const main = async () => {
	
	const columns = [
		"email",
		"username",
		"firstname",
		"lastname",
		"password",
		"latitude",
		"longitude",
		"last_seen",
		"date_of_birth",
		"gender",
		"sexual_orientation",
		"bio",
		"popularity_score",
		"status"
	];

	var male_images = await generateImages("male");
	var female_images = await generateImages("female");

	for (let i = 0; i < LIMIT; i++) {

		let values = generateProfile();
		let data = await db.insert("users", columns, values);

		let interests = generateInterests(data.insertId);
		await db.pool.query(`INSERT INTO interests (user_id, interest) VALUES ${interests.join(", ")}`);
		
		if (values[9] === "male") {
			await db.insert("images", ["user_id", "image"], [data.insertId, male_images[0]]);
			male_images = male_images.splice(1, male_images.length)
		} else {
			await db.insert("images", ["user_id", "image"], [data.insertId, female_images[0]]);
			female_images = female_images.splice(1, female_images.length)
		}

		let [views, likes] = generateViewsAndLikes(data.insertId);
		await db.pool.query(`INSERT INTO views (user_id, target_id, date) VALUES ${views.join(", ")}`);
		await db.pool.query(`INSERT INTO likes (user_id, target_id, date) VALUES ${likes.join(", ")}`);

		console.log(`> FAKE PROFILE WITH ID ${data.insertId} (${i + 1}/${LIMIT}) SEEDED.`);

	}

	process.exit(0);

};

console.log(`[ CREATING ${LIMIT} FAKE PROFILES ]`);
main();
