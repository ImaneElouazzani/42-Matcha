const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const http = require("http");

const config = require("./config");
const routes = require("./routes");

const app = express();
const server = http.createServer(app);
const io = require("socket.io").listen(server);

io.on("connection", socket => {
	socket.on("join", (req) => {
		socket.join(req.user_id);
	});

	socket.on("notification", (req) => {
		req.user_id ? io.to(req.user_id).emit("notification") : null;
		req.target_id ? io.to(req.target_id).emit("notification") : null;
	});
	socket.on("message", (req) => {
		io.to(req.user_id).emit("message");
		io.to(req.target_id).emit("message");
	});
});

app.use(bodyParser.urlencoded({ "limit": "1mb", "extended": true }));
app.use(bodyParser.json({ "limit": "1mb" }));
app.use(session({
	"secret": config.secret,
	"resave": false,
	"saveUninitialized": false
}));
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
	res.header("Access-Control-Allow-Origin", `${config.host}:${config.ports.client}`);
	res.header("Access-Control-Allow-Methods", "GET, POST");
	res.header("Access-Control-Allow-Credentials", true);
	next();
})
app.use(routes);
app.use((req, res, next) => {
	res.status(404).json({
		"status": 404,
		"success": false,
		"message": "Not Found"
	});
});

config.path = __dirname;
server.listen(config.ports.server);
