const moment = require("moment");

/*
** -------------------------------------------------------------------------- **
**	RegExp from: 
**	https://emailregex.com/
**	https://www.ietf.org/rfc/rfc5322.txt
** -------------------------------------------------------------------------- **
*/

exports.email = (email) => {
	let re = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
	return re.test(email);
};

/*
** -------------------------------------------------------------------------- **
**	^			# start of the line
**	[a-z0-9_-]	# allowed characters
**	{3,15}		# allowed length (at least 3 characters, max. 15)
**	$			# end of the line
** -------------------------------------------------------------------------- **
*/

exports.username = (username) => {
	let re = new RegExp(/^[a-zA-Z0-9_-]{3,15}$/);
	return re.test(username);
};

/*
** -------------------------------------------------------------------------- **
**	No validation here, because first & last names could be composed of
**	different unicodes. Must be at least 2 characters.
**
**	RegExp that might work tho: https://stackoverflow.com/a/45871742
** -------------------------------------------------------------------------- **
*/

exports.firstname = (firstname) => {
	let re = new RegExp(/^.{2,}$/);
	return re.test(firstname);
};

exports.lastname = (lastname) => {
	let re = new RegExp(/^.{2,}$/);
	return re.test(lastname);
};

/*
** -------------------------------------------------------------------------- **
**	^					# start of the line
**	(?=.*[a-z])			# must contain at least one lowercase letter
**	(?=.*[A-Z])			# must contain at least one uppercase letter
**	(?=.*\d)			# must contain at least one number
**	(?=.*[^\da-zA-Z])	# must contain at least one special character
**	.{8,}				# must be at least 8 characters long
**	$					# end of the line
**
**	RegExp from: https://stackoverflow.com/a/5859963 
** -------------------------------------------------------------------------- **
*/

exports.password = (password) => {	
	let re = RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/);
	return re.test(password);
};

/*
** -------------------------------------------------------------------------- **
**	Use moment (www.momentjs.com) to check if the date is correctly formatted.
** -------------------------------------------------------------------------- **
*/

exports.date_of_birth = (date_of_birth) => {
	return (moment(date_of_birth, "YYYY-MM-DD HH:mm:ss", true).isValid()
		|| moment(date_of_birth, "YYYY-MM-DD", true).isValid())
		&& moment().diff(date_of_birth, "YEARS") < 101;
};

/*
** -------------------------------------------------------------------------- **
**	Gender can either be "male" or "female".
** -------------------------------------------------------------------------- **
*/

exports.gender = (gender) => {
	return gender === "male" || gender === "female";
};

/*
** -------------------------------------------------------------------------- **
**	Sexual orientation can be "bisexual", "homosexual", or "heterosexual".
** -------------------------------------------------------------------------- **
*/

exports.sexual_orientation = (sexual_orientation) => {
	return sexual_orientation === "bisexual" ||
		   sexual_orientation === "homosexual" ||
		   sexual_orientation === "heterosexual";
};

/*
** -------------------------------------------------------------------------- **
**	The only limitation here is a maximum of 280 characters.
** -------------------------------------------------------------------------- **
*/

exports.bio = (bio) => {
	return bio.length <= 280;
};

/*
** -------------------------------------------------------------------------- **
**	^			# start of the line
**	#			# start with a diese
**	[a-z0-9]	# allowed characters
**	{1,30}		# allowed length (at least 1 characters, max. 30)
**	$			# end of the line
** -------------------------------------------------------------------------- **
*/

exports.interest = (interest) => {
	let re = new RegExp(/^#[a-zA-Z0-9]{1,30}$/);
	return re.test(interest);
};

/*
** -------------------------------------------------------------------------- **
**	Accepting JPEG and PNG headers only.
** -------------------------------------------------------------------------- **
*/

exports.image = (image) => {
	return image.match(/^data:image\/png;base64,/) !== null ||
		   image.match(/^data:image\/jpeg;base64,/) !== null;
};
