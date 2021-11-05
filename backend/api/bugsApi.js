const express = require("express");
const router = express.Router();
const Bug = require("../models/bugModel");
const User = require("../models/userModel");
const authenticateJWT = require("../middleware/authenticateJWT");
const authenticateBoard = require("../middleware/authenticateBoard");
const cors = require("cors");

const corsOptions = {
	origin: "localhost:3000",
	optionsSuccessStatus: 200,
};
// GET REQUESTS
// List all the bugs
router.get("/bugs", cors(), (req, res) => {
	Bug.find()
		.then((result) => {
			res.json(result);
		})
		.catch((err) => {
			res.json(err);
		});
});

// LIst BUG by id
router.get("/onebug", (req, res) => {
	Bug.findById(req.id)
		.then((result) => res.json(result))
		.catch((err) => res.json(err));
});

// List all the BUGS an USER is asigned to solve
router.get("/mybugs", authenticateJWT, cors(), (req, res) => {
	User.findOne({username: req.user})
		.then((result) => {
			res.json(result.bugsToSolve);
		})
		.catch((err) => {
			res.json(err);
		});
});

//List URGENT bugs assigned to user
router.get("/myurgentbugs", authenticateJWT, cors(), (req, res) => {
	User.findOne({username: req.user})
		.then((result) => {
			res.json(result.bugsToSolve.filter((bug) => bug.priority === 3));
		})
		.catch((err) => {
			res.json(err);
		});
});

// List all BUGS form a BOARD
router.get("/boardbugs", authenticateBoard, cors(), (req, res) => {
	console.log("tu smo", req.board);
	Bug.find({board: req.board})
		.then((result) => {
			console.log(result);
			res.json(result);
		})
		.catch((err) => {
			res.json(err);
		});
});

// POST REQUESTS
// Add a bug
router.post("/add", authenticateJWT, (req, res) => {
	console.log(req.body, req.user);
	const bug = new Bug({
		title: req.body.title,
		reporter: req.user,
		description: req.body.description,
		priority: req.body.priority,
		solver: req.body?.solver || "No asignees",
		solvingTime: req.body?.solvingTime,
		status: 0,
		board: req.body.board,
	});
	bug
		.save()
		.then((result) => {
			res.json(result);
		})
		.catch((err) => {
			res.json(err);
		});
});

// PUT REQUESTS
//Asign/unasign user from solving a bug
router.put("/asign", authenticateJWT, async (req, res) => {
	console.log(req.body);
	let thisBug = await Bug.findById(req.body.id);
	let solver =
		thisBug.solver == req.body.username ? "No asignees" : req.body.username;
	let thisbug = await Bug.findOneAndUpdate(
		{_id: req.body.id},
		{solver: solver},
		{new: false}
	);
	//let thisbug = await Bug.findById("611b938143651e4da4dc0067");
	//console.log(Bug.findById(req.body.id).solver);
	let newbug = await Bug.findById(req.body.id);
	console.log(newbug);
	if (thisBug.solver == req.body.username) {
		let thisuser = await User.findOneAndUpdate(
			{username: req.body.username},
			{
				$pull: {
					bugsToSolve: {_id: newbug._id},
				},
			}
		);
	} else {
		let thisuser = await User.findOneAndUpdate(
			{username: req.body.username},
			{
				$addToSet: {
					bugsToSolve: newbug,
				},
			}
		);
	}
	res.json(newbug);
});

router.put("/solve", authenticateJWT, async (req, res) => {
	//console.log(req.body);
	let thisBug = await Bug.findById(req.body.id);
	let thisbug = await Bug.findOneAndUpdate(
		{_id: req.body.id},
		{status: req.body.status},
		{new: false}
	);
	let isasigned = false;
	await User.findOne({username: req.user}).then((result) => {
		result.bugsToSolve.forEach((item) => {
			if (item._id == req.body.id) {
				console.log("tu smo");
				isasigned = true;
			}
		});
	});
	let newbug = await Bug.findById(req.body.id);
	if (isasigned) {
		User.findOneAndUpdate(
			{username: req.user},
			{
				$pull: {
					bugsToSolve: {_id: thisBug._id},
				},
			}
		);

		User.findOneAndUpdate(
			{username: req.user},
			{
				$addToSet: {
					bugsToSolve: newbug,
				},
			}
		);
	}
	//let thisbug = await Bug.findById("611b938143651e4da4dc0067");
	//console.log(Bug.findById(req.body.id).solver);

	//console.log(newbug);
	res.json(newbug);
});

module.exports = router;
