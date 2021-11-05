const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("./models/userModel");

function initialize(passport) {
	const authenticateUser = async (email, password, done) => {
		const user = getUserByEmail(email);
		if (user == null) {
			return done(null, false, { message: "No user with this email" });
		}
		try {
			if (await bcrypt.compare(password, user.password)) {
				return done(null, user);
			} else {
				return done(null, false, { message: "Passport incorect" });
			}
		} catch (r) {
			return done(e);
		}
	};
	passport.use(
		new localStrategy(
			{
				usernameField: "email",
			},
			authenticateUser
		)
	);
}

module.exports = initialize;
