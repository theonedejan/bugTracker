const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middleware/authenticateJWT");
const authenticateBoard = require("../middleware/authenticateBoard");
const Board = require("../models/boardModel");
const User = require("../models/userModel");

//GET METHODS
//GET All boards user has access to
router.get("/", authenticateJWT, (req, res) => {
	Board.find()
		.then((result) => {
			let myboards = result.filter((element) => {
				console.log("User", req.user);
				const members = element.members;
				console.log("Members ", members);

				const newmembers = members.filter((e) => e.username == req.user);
				console.log(members);
				console.log(newmembers);
				console.log(newmembers[0] ? "tru" : "fols");
				console.log();
				if (newmembers[0]) return "element";
			});
			console.log(myboards);
			res.json(myboards);
		})
		.catch((err) => {
			res.json(err);
		});
});

//POST METHODS
//Create new board
router.post("/", authenticateJWT, (req, res) => {
	let board = new Board({
		title: req.body.title,
		members: [{username: req.user, role: 0}],
		description: req.body.description,
	});
	board
		.save()
		.then((result) => res.json(result))
		.catch((err) => res.json(err));
});

//Register member to board
router.post("/register", authenticateBoard, async (req, res) => {
	let board = await Board.findById(req.body.board);
	let user = await User.findOne({username: req.body.username});
	let role = req.body.role || 0;
	console.log("idemo", user);
	console.log(user?.username);
	if (!user) {
		console.log("there is no user here");
		res.json({err: "Invalid Username"});
	} else if (board.members.filter((e) => e == req.body.username).length > 0) {
		console.log("vec je tu");
		let thisboard = await Board.findOneAndUpdate(
			{_id: req.body.board},
			{
				$pull: {
					members: {username: req.body.username},
				},
			}
		);
		res.json(board);
	} else {
		//console.log("dodajemo");
		let thisboard = await Board.findOneAndUpdate(
			{_id: req.body.board},
			{
				$addToSet: {
					members: {username: req.body.username, role},
				},
			}
		);
		//console.log(thisboard);
		res.json(board);
	}
});

module.exports = router;
