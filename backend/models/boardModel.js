const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const boardSchema = new Schema({
	title: {
		type: String,
		require: true,
	},
	members: {
		type: Array,
		require: false,
	},
	description: {
		type: String,
		require: false,
	},
});

const Board = mongoose.model("Board", boardSchema);
module.exports = Board;
