const mailer = require("nodemailer");
const crypto = require("crypto");

const config = require("../config");
const db = require("./db");

const account = mailer.createTransport(config.mail);

/*
** -------------------------------------------------------------------------- **
**	Send an email to `email` to reset the user's password.
** -------------------------------------------------------------------------- **
*/

exports.reset_password = async (email) => {

	try {

		let data = await db.select(["id"], "users", ["email"], [email]);
		if (data.length === 0)
			return false;

		let token = crypto.randomBytes(16).toString("hex");
		await db.insert("tokens", ["user_id", "token", "type"], [data[0].id, token, "password"]);

		let url = `${config.host}:${config.ports.client}/reset_password?token=${token}`;
		let options = {
			"from": '"MATCHA" <matcha@1337.ma>',
			"to": email,
			"subject": "MATCHA - Password reset",
			"html": `<a href='${url}'>Please, click here to reset your password.</a>`
		};	

		account.sendMail(options, (error, info) => {
			if (error) {
				throw new Error(error.message);
			}
		}); 

		return true;

	} catch (error) {

		throw new Error(error.message);
		return false;

	}
};

/*
** -------------------------------------------------------------------------- **
**	Send an email to `email` to confirm the user's account.
** -------------------------------------------------------------------------- **
*/

exports.confirm_account = async (email) => {
	
	try {

		let data = await db.select(["id"], "users", ["email"], [email]);
		if (data.length === 0)
			return false;

		let token = crypto.randomBytes(16).toString("hex");
		await db.insert("tokens", ["user_id", "token", "type"], [data[0].id, token, "email"]);
	
		let url = `${config.host}:${config.ports.client}/confirm_account?token=${token}`;
		let options = {
			"from": '"MATCHA" <matcha@1337.ma>',
			"to": email,
			"subject": "MATCHA - Account confirmation",
			"html": `<a href='${url}'>Please, click here to activate your account.</a>`
		};

		account.sendMail(options, (error, info) => {
			if (error) {
				throw new Error(error.message);
			} 
		});

		return true;

	} catch (error) {
	
		throw new Error(error.message);
		return false;

	}

};
