const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const authenticateJWT = require("../middleware/authenticateJWT");

const initializePassport = require("../passport-config");
initializePassport(passport, async (email) => {
	try {
		const taken = await User.findOne({ email: req.body.email });
		return taken;
	} catch (e) {}
});

//Trial
router.get("/", authenticateJWT, (req, res) => {
	res.send(req.user);
});

// Register a User
router.post("/register", async (req, res) => {
	try {
		const taken = await User.findOne({ email: req.body.email });
		const takenUsername = await User.findOne({ username: req.body.username });
		console.log(taken, takenUsername);
		if (!taken || !takenUsername) {
			const hashedPass = await bcrypt.hash(req.body.password, 10);
			console.log(req.body);
			const user = new User({
				name: req.body.name,
				lastName: req.body.lastName,
				username: req.body.username,
				email: req.body.email,
				password: hashedPass,
			});

			user
				.save()
				.then((result) => res.json(result))
				.catch((err) => res.json(err));
		} else {
			res.send("email taken");
		}
	} catch (e) {
		console.log(e);
		res.json(e);
	}
});

// Login
router.post("/login", async (req, res) => {
	res.header("Access-Control-Allow-Origin", "*");
	console.log("Obradjuje se", req.body.username, req.body.password);
	try {
		const user = await User.findOne({ username: req.body.username });
		if (!user) {
			console.log("no user");
			res.status(403).send("Non existant user");
		} else {
			try {
				const match = await bcrypt
					.compare(req.body.password, user.password)
					.then((result) => {
						if (result) {
							const token = jwt.sign(
								user.username,
								process.env.ACCESS_TOKEN_SECRET
							);
							console.log("result", result, token);
							res.json({
								Token: token,
								username: req.body.username,
								isAuthenticated: true,
							});
						} else {
							console.log("Wrong");
							res.send("Wrong password");
						}
					});
			} catch (er) {
				console.log(er);
				res.send(er);
			}
		}
	} catch (err) {
		res.send(err);
	}
});

module.exports = router;
