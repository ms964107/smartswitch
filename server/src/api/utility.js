module.exports.error_response = function error_response(username = null, code = '') {
	const error = !String(code).match(/^[0-8]$/) ? "9" : code
	return { username: username, success: false, message: "ERROR STATUS " + error }
}

const validation_rules = {
	"name": {
		"limit": 15,
		"rule": /^[a-zA-Z0-9]*$/,
	},
	"password": {
		"limit": 20,
		"text": "Up to 20 Any Characters",
	}
}
module.exports.validation = function validation(input, type, range = null) {
	if (type === "name" || type === "password") {
		return input.length <= validation_rules[type].limit &&
			input.match(validation_rules[type].rule)
	} else if (type === "int") {
		return !isNaN(input) && input <= range
	} else if (type === "route") {
		return input === "highway" || input === "urban" || input === "combined"
	} else if (type === "port") {
		return input < 4 && input >= 0
	} else if (type === "config") {
		return input === "Location" || input === "ECO"
	}
}

module.exports.forChargingAlgo = function forChargingAlgo(input, type = "reg") {
	if (type === "all") {
		return input.username === "chargingAlgo";
	} else if (type === "reg") {
		return input.username === "chargingAlgo" && input.portID < 4 && input.portID >= 0;
	} else {
		return input.username === "chargingAlgo" &&
			input.portID < 4 && input.portID >= 0 &&
			(input.isCharging === 1 || input.isCharging === 0);
	}
}

module.exports.connectCheck = function connectCheck(input) {
	return input.portID < 4 && input.portID >= 0 && (input.isConnected === 0 || input.isConnected === 1);
}