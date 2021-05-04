module.exports = {
	ports: {
		server: process.env.SERVER,
		client: process.env.CLIENT
	},
	host: process.env.URL,
	secret: "vU9-LdX@m3TzftVn8Cfa7am7GbUCffmt",
	mail: {
		sendmail: true,
		newline: 'unix',
		path: '/usr/sbin/sendmail'
	},
	path: ""
};
