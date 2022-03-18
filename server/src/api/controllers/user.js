const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const model = require('../models/user.js')
const utility = require('../utility.js')

module.exports.register = function register(req, res) {
	if (!utility.validation(req.body.username, "name") ||
		!utility.validation(req.body.password, "password")) {
		res.send(utility.error_response(req.body.username, "7"))
		return
	}
	res.setHeader('Content-Type', 'application/json');
	model.selectUser(req.body.username, async function (error, result) {
		if (error) {
			res.send(utility.error_response(req.body.username, error))
			return
		}
		if (result[0] !== undefined) {
			res.send(utility.error_response(req.body.username, '1'))
			return
		}
		const hash = await bcrypt.hash(req.body.password, 10)
		const newUser = {
			username: req.body.username,
			password: hash
		}
		model.insertNewUser(newUser, function (error) {
			if (error) {
				res.send(utility.error_response(req.body.username, error))
			} else {
				res.send({ username: req.body.username, success: true })
			}
		})
	})
}

module.exports.changePassword = function changePassword(req, res) {
	if (!utility.validation(req.body.username, "name") ||
		!utility.validation(req.body.old_password, "password") ||
		!utility.validation(req.body.new_password, "password")) {
		res.send(utility.error_response(req.body.username, "7"))
		return
	}
	model.selectUser(req.body.username, async function (error, result) {
		if (error) {
			res.send(utility.error_response(req.body.username, error))
			return
		}
		if (result[0] === undefined) {
			res.send(utility.error_response(req.body.username, '0'))
			return
		}
		const user = JSON.parse(JSON.stringify(result[0]));
		if (await bcrypt.compare(req.body.old_password, user.password)) {
			res.setHeader('Content-Type', 'application/json');
			const hash = await bcrypt.hash(req.body.new_password, 10)
			const newPassword = {
				username: req.body.username,
				password: hash
			}
			model.changePassword(newPassword, async function (error) {
				if (error) {
					res.send(utility.error_response(req.body.username, error))
				} else {
					res.send({ username: req.body.username, success: true })
				}
			})
		} else {
			res.send(utility.error_response(req.body.username, '2'))
		}
	})
}

module.exports.login = function login(req, res) {
	if (!utility.validation(req.body.username, "name") ||
	!utility.validation(req.body.password, "password")) {
		return res.send(utility.error_response(req.body.username, "7"))
	}
	model.selectUser(req.body.username, async function (error, result) {
		if (error) {
			return res.send(utility.error_response(req.body.username, error))
		}
		if (result[0] === undefined) {
			return res.send(utility.error_response(req.body.username, '0'))
		}
		const user = JSON.parse(JSON.stringify(result[0]));
		if (await bcrypt.compare(req.body.password, user.password)) {
			res.setHeader('Content-Type', 'application/json');
			const user = { username: req.body.username }
			const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
			const expiresTime = req.body.username === 'chargingAlgo' ? {} : { expiresIn: '1h' }
			const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, expiresTime)
			const hashToken = await bcrypt.hash(refreshToken, 10)
			model.updateNewToken(req.body.username, hashToken, async function (error) {
				if (error) {
					res.send(utility.error_response(req.body.username, error))
				} else {
					res.send({ username: req.body.username, success: true, token: token, refreshToken: refreshToken })
				}
			})
		} else {
			res.send(utility.error_response(req.body.username, '2'))
		}
	})
}

module.exports.config = function config(req, res) {
	if (!utility.validation(req.body.type, "config") ||
		!utility.validation(req.body.username, "name")) {
		return res.send(utility.error_response(req.body.username, "7"))
	}
	model.changeECOorLocation(req.body.type, req.body.value, async function (error) {
		if (error) {
			res.send(utility.error_response(req.body.username, error))
		} else {
			res.send({ username: req.body.username, success: true })
		}
	})
}

module.exports.configInfo = function configInfo(req, res) {
	if (!utility.validation(req.body.username, "name")) {
		return res.send(utility.error_response(req.body.username, "7"))
	}
	model.getECOandLocation(async function (error, config) {
		if (error) {
			res.send(utility.error_response(req.body.username, error))
		} else {
			res.send({ data: config, success: true })
		}
	})
}

module.exports.location = function location(req, res) {
	if (!utility.validation(req.body.username, "name")) {
		return res.send(utility.error_response(req.body.username, "7"))
	}
	model.getLocationList(async function (error, locations) {
		if (error) {
			res.send(utility.error_response(req.body.username, error))
		} else {
			res.send({ data: locations, success: true })
		}
	})
}
