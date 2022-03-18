const passport = require("passport")

const utility = require('../utility.js')
const passportUtility = require('../passport-config.js')
const controller = require('../controllers/user.js')
const jwt = require('../controllers/jwt.js')

require("dotenv").config()

const users = []
const refreshTokens = []

module.exports.users = users

module.exports.userAPI = function(app){	
	app.post("/login", (req, res) => {
		controller.login(req, res)
	})

	// register
	app.post("/register", (req, res) => {
		controller.register(req, res)
	});

	// change password
	app.put("/changePassword", jwt.authentication, (req, res) => {
		controller.changePassword(req, res)
	});

	// change ECO or location
	app.put("/config", jwt.authentication, (req, res) => {
		controller.config(req, res)
	});

	// get config info
	app.put("/configInfo", jwt.authentication, (req, res) => {
		controller.configInfo(req, res)
	});

	// get location list
	app.put("/location", jwt.authentication, (req, res) => {
		controller.location(req, res)
	});
}