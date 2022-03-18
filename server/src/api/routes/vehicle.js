const controller = require('../controllers/vehicle.js')
const jwt = require('../controllers/jwt.js')

module.exports.vehicleAPI = function(app){	
	app.post("/add", jwt.authentication, (req, res) => {
		controller.add(req, res)
	})

	app.put("/modify", jwt.authentication, (req, res) => {
		controller.modify(req, res)
	});

	app.put("/delete", jwt.authentication, (req, res) => {
		controller.delete(req, res)
	});

	app.get("/models", jwt.authentication, (req, res) => {
		controller.model(req, res)
	});

	app.get("/vehicles", jwt.authentication, (req, res) => {
		controller.vehicles(req, res)
	});

	app.put("/portInfo", jwt.authentication, (req, res) => {
		controller.portInfo(req, res)
	});

	app.put("/allPortInfo", jwt.authentication, (req, res) => {
		controller.allPortInfo(req, res)
	});

	app.put("/charging", jwt.authentication, (req, res) => {
		controller.charging(req, res)
	});

	app.put("/connect", (req, res) => {
		controller.connect(req, res)
	});

	app.put("/soc", (req, res) => {
		controller.soc(req, res)
	});
}