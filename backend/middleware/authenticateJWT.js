const jwt = require("jsonwebtoken");
const express = require("express");

//Authenticates JWT to board and returns user email

function authenticateJWT(req, res, next) {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (token == null) return res.sendStatus(403);

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) return res.sendStatus(403);
		req.user = user;
		next();
	});
}
module.exports = authenticateJWT;

//Import from API
// const authenticateJWT = require('../middleware/authenticateBoard')
