const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bugSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		reporter: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		solver: {
			type: String,
			required: false,
		},
		priority: {
			type: Number,
			required: true,
		},
		solvingTime: {
			type: Number,
			required: false,
		},
		status: {
			type: Number,
			required: true,
		},
		board: {
			type: String,
			required: false,
		},
	},
	{ timestamps: true }
);

const Bug = mongoose.model("Bug", bugSchema);

module.exports = Bug;
