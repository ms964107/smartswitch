const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const model = require('../models/vehicle.js')
const utility = require('../utility.js')

module.exports.add = function addVehicle(req, res) {
	if (!utility.validation(req.body.vehicle.name, "name") ||
		!utility.validation(req.body.vehicle.portID, "port") ||
		!utility.validation(req.body.vehicle.route, "route")) {
		return res.send(utility.error_response(req.body.username, "7"))
	}
	model.addVehicle(req.body.vehicle, async function (error, result) {
		if (error) {
			return res.send(utility.error_response(req.body.username, error))
		}
		model.addPort(req.body.vehicle.portID, result.insertId, req.body.vehicle.ranking, async function (error) {
			if (error) {
				return res.send(utility.error_response(req.body.username, error))
			}
			return res.send({ username: req.body.username, vehicleName: req.body.vehicle.name, success: true })
		})
	})
}

module.exports.model = function modelList(req, res) {
	model.getModelList(async function (error, result) {
		if (error) {
			return res.send(utility.error_response(null, error))
		}
		if (result === undefined) {
			return res.send({ data: [], success: true })
		} else {
			return res.send({ data: result, success: true })
		}
	})
}

module.exports.delete = function deleteVehicle(req, res) {
	model.deleteVehicle(req.body.vehicleID, req.body.portID, async function (error) {
		if (error) {
			return res.send(utility.error_response(req.body.username, error))
		}
		return res.send({ username: req.body.username, success: true })
	})
}

module.exports.modify = function modifyVehicle(req, res) {
	if (!utility.validation(req.body.vehicle.name, "name") ||
		!utility.validation(req.body.vehicle.route, "route")) {
		return res.send(utility.error_response(req.body.username, "7"))
	}
	model.modifyVehicle(req.body.vehicle, async function (error) {
		if (error) {
			res.send(utility.error_response(req.body.username, error))
		} else {
			model.clearPort(req.body.vehicle.id, req.body.vehicle.ranking, async function (error) {
				if (error) {
					return res.send(utility.error_response(req.body.username, error))
				}
				model.addPort(req.body.vehicle.portID, req.body.vehicle.id, req.body.vehicle.ranking, async function (error) {
					if (error) {
						return res.send(utility.error_response(req.body.username, error))
					}
					return res.send({ username: req.body.username, vehicleName: req.body.vehicle.name, success: true })
				})
			})
		}
	})
}

module.exports.vehicles = function vehicleList(req, res) {
	model.getVehicleList(async function (error, vehicleList) {
		if (error) {
			return res.send(utility.error_response(null, error))
		}
		if (vehicleList === undefined) {
			return res.send({ data: [], success: true })
		}
		model.getModelList(async function (error, modelList) {
			if (error) {
				return res.send(utility.error_response(null, error))
			}
			if (modelList === undefined) {
				return res.send({ data: [], success: true })
			}
			model.getPortList(async function (error, portList) {
				if (error) {
					return res.send(utility.error_response(null, error))
				}
				for (let i = 0; i < portList.length; i++) {
					for (let j = 0; j < vehicleList.length; j++) {
						if (portList[i].vehicleID === vehicleList[j].id) {
							vehicleList[j].portID = portList[i].id;
							vehicleList[j].isCharging = portList[i].isCharging;
							vehicleList[j].ranking = portList[i].ranking;
						}
					}
				}
				
				return res.send({ data: { vehicleList: vehicleList, modelList: modelList }, success: true })
			})
		})
	})
}

module.exports.portInfo = function portInfo(req, res) {
	if (!utility.forChargingAlgo(req.body, "reg")) {
		return res.send(utility.error_response(req.body.username, "7"))
	}
	model.getPortInfo(req.body.portID, async function (error, portInfo) {
		if (error) {
			return res.send(utility.error_response(null, error))
		}
		if (portInfo === undefined) {
			return res.send({ data: [], success: true })
		} else {
			return res.send({ data: portInfo, success: true })
		}
	})
}

module.exports.allPortInfo = function allPortInfo(req, res) {
	if (!utility.forChargingAlgo(req.body, "all")) {
		return res.send(utility.error_response(req.body.username, "7"))
	}

	model.getAllPortInfo(async function (error, allPortInfo) {
		if (error) {
			return res.send(utility.error_response(null, error))
		}
		if (allPortInfo === undefined) {
			return res.send({ data: [], success: true })
		} else {
			return res.send({ data: allPortInfo, success: true })
		}
	})
}

module.exports.charging = function charging(req, res) {
	if (!utility.forChargingAlgo(req.body, "charging")) {
		return res.send(utility.error_response(req.body.username, "7"))
	}
	model.modifyCharging(req.body, async function (error) {
		if (error) {
			res.send(utility.error_response(req.body.username, error))
		} else {
			res.send({ username: req.body.username, portID: req.body.portID, success: true })
		}
	})
}

module.exports.soc = function soc(req, res) {
	if (!utility.validation(req.body.portID, "port") ||
		!utility.validation(req.body.soc, "int", 100)) {
		return res.send(utility.error_response(req.body.username, "7"))
	}
	model.modifySOC(req.body, async function (error) {
		if (error) {
			res.send(utility.error_response(req.body.username, error))
		} else {
			res.send({ username: req.body.username, portID: req.body.portID, success: true })
		}
	})
}

module.exports.connect = function connect(req, res) {
	if (!utility.connectCheck(req.body)) {
		return res.send(utility.error_response(req.body.username, "7"))
	}
	model.modifyConnect(req.body, async function (error) {
		if (error) {
			res.send(utility.error_response(req.body.username, error))
		} else {
			res.send({ username: req.body.username, portID: req.body.portID, success: true })
		}
	})
}