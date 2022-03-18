const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const utility = require('../utility.js')
const model = require('../models/user.js')

module.exports.authentication = function authentication(req, res, next) {
	const header = req.headers['authorization']
	const token = header && header.split(' ')[1]
	if (token == null) {
		return res.send(utility.error_response(null, "5"))
	}

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
		if (error) {
			return res.send({ username: req.body.username, invalidToken: true, success: false, message: "ERROR STATUS 6" })
		}
		req.user = user
		next()
	})
}

module.exports.refreshToken = function refreshToken(req, res, next) {
	if (req.body.refreshToken === null) {
		return res.send(utility.error_response(req.body.username, "5"))
	}

	model.selectUser(req.body.username, async function (error, result) {
		if (error) {
			return res.send(utility.error_response(req.body.username, error))
		}
		if (result[0] === undefined) {
			return res.send(utility.error_response(req.body.username, '0'))
		}
		const user = JSON.parse(JSON.stringify(result[0]));

		if (await bcrypt.compare(req.body.refreshToken, user.refreshToken)) {
			res.setHeader('Content-Type', 'application/json');
			jwt.verify(req.body.refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
				if (error) {
					return res.send(utility.error_response(req.body.username, "6"))
				}
				const sign = { username: user.username }
				const newToken = jwt.sign(sign, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
				res.send({ username: req.body.username, success: true, token: newToken, refreshToken: req.body.refreshToken })
			})
		} else {
			res.send(utility.error_response(req.body.username, '6'))
		}
	})
}