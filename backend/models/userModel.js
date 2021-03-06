const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		bugsToSolve: {
			type: Array,
			required: false,
		},
		bugsReported: {
			type: Array,
			required: false,
		},
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
