const controller = require('../controllers/jwt.js')

module.exports.tokenAPI = function(app){	
	app.post("/token", (req, res) => {
		controller.refreshToken(req, res)
	});
}