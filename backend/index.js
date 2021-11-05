if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Bug = require("./models/bugModel");
const passport = require("passport");
const cors = require("cors");

// Express App
const app = express();
const PORT = process.env.PORT || 5000;

// Database
mongoose.set("useFindAndModify", false);
const dbURI =
	"mongodb+srv://admin:Vukadinovic2021*@cluster0.vxjdl.mongodb.net/TrialData?retryWrites=true&w=majority";
mongoose
	.connect(dbURI, { useUnifiedTopology: true, useNewUrlParser: true })
	.then((result) => {
		console.log("Connected");
		app.listen(PORT, () => {
			console.log(`Server started on port ${PORT}`);
		});
	})
	.catch((err) => console.log(err));

//Bodyparser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//CORS middleware
app.use(
	cors({
		origin: "http://localhost:3000",
	})
);
//app.use(passport.initialize);

//Bugs API
app.use("/", require("./api/bugsApi"));

// Users API
app.use("/user", require("./api/userApi"));

//Boards API
app.use("/boards", require("./api/boardApi"));
