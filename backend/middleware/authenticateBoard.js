const jwt = require("jsonwebtoken");
const express = require("express");
const Board = require("../models/boardModel");

//Authenticates user to board and returns user email

async function authenticateBoard(req, res, next) {
	if (req.headers.board == "undefined") return res.sendStatus(400);
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	const board = await Board.findById(req.headers.board);
	console.log(token);
	console.log(req.headers.board);
	if (token == null) return res.sendStatus(403);
	if (board == null) return res.sendStatus(400);
	// console.log(board.title);
	// next();
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) return res.sendStatus(403);

		req.user = user;
		req.board = board._id;
		if (!board.members.filter((e) => e.username == user) > 0)
			return res.sendStatus(403);
		next();
	});
}
module.exports = authenticateBoard;
