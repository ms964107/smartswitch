// passport
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const utility = require('./utility.js')
const model = require('./models/user.js')

module.exports.initialize = function initialize(passport) {
	const authenticateUser = async (username, password, done) => {
		model.selectUser(username, async function (error, result) {
			if (error) {
				res.send(utility.error_response(username, error))
				return
			}
			if (result[0] === undefined) {
				return done(null, false, utility.error_response(username, '0'))
			}
			const user = JSON.parse(JSON.stringify(result[0]));
			if (await bcrypt.compare(password, user.password)) {
				return done(null, user, { user: user.username, success: true })
			} else {
				return done(null, false, utility.error_response(username, '2'))
			}
		})
	}

	passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser))
	passport.serializeUser((user, done) => done(null, user.username))
	passport.deserializeUser((username, done) =>
		model.selectUser(username, async function (error, result) {
			const user = JSON.parse(JSON.stringify(result[0]));
			done(null, user)
		})
	)
}

module.exports.isAuthenticated = function checkAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next()
	}

	res.send(utility.error_response(null, "4"))
}
  
module.exports.isNotAuthenticated = function checkNotAuthenticated(req, res, next) {
	if (!req.isAuthenticated()) {
		return next()
	}

	res.send(utility.error_response(null, "3"))
}
