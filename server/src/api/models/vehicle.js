const mysql = require('../mysql-config.js')

module.exports.getModelList = function(callback){
	const sql = `select * from VehicleModel;`;
	mysql.query(sql, callback);
}

module.exports.getVehicleList = function(callback){
	const sql = `select * from UserVehicle;`;
	mysql.query(sql, callback);
}

module.exports.getPortList = function(callback){
	const sql = `select * from Port;`;
	mysql.query(sql, callback);
}

module.exports.deleteVehicle = function(id, portID, callback){
	let sql = ''
	if (portID >= 0 && portID < 4) {
		sql += `update Port set vehicleID = NULL, ranking = NULL where id = '${portID}';`;
	}
	sql += `delete from UserVehicle where id=${id};`;
	mysql.query(sql, callback);
}

module.exports.modifyVehicle = function(vehicle, callback){
	const sql = `update UserVehicle set name = '${vehicle.name}', modelID = ${vehicle.modelID}, soc = ${vehicle.startingSoc}, isDoneCharging = 0, departure = '${vehicle.departure}', distance = ${vehicle.distance}, route = '${vehicle.route}' where id = '${vehicle.id}';`;
	mysql.query(sql, callback);
}

module.exports.addVehicle = function(vehicle, callback){
	const sql = `insert into UserVehicle (id, name, modelID, soc, isDoneCharging, departure, distance, route) values (default, '${vehicle.name}', ${vehicle.modelID}, ${vehicle.startingSoc}, 0, '${vehicle.departure}', ${vehicle.distance}, '${vehicle.route}');`;
	mysql.query(sql, callback);
}

module.exports.addPort = function(portID, vehicleID, ranking, callback){
	let sql = `update Port set ranking = NULL where ranking = ${ranking};`;
	sql += `update Port set vehicleID = ${vehicleID}, ranking = ${ranking} where id = ${portID};`;
	mysql.query(sql, callback);
}

module.exports.clearPort = function(vehicleID, ranking, callback){
	let sql = `update Port set vehicleID = NULL, ranking = NULL where vehicleID = ${vehicleID};`;
	sql += `update Port set ranking = NULL where ranking = ${ranking};`;
	mysql.query(sql, callback);
}

module.exports.getPortInfo = function(portID, callback){
	const sql = `select Port.id as portID, Port.ranking, Port.vehicleID, Port.isCharging, Port.isConnected, UserVehicle.name as vehicleName, UserVehicle.modelID, UserVehicle.soc, UserVehicle.isDoneCharging, UserVehicle.departure, UserVehicle.distance, UserVehicle.route, VehicleModel.brand, VehicleModel.model, VehicleModel.chargeRate, VehicleModel.batteryCap, VehicleModel.consumptionCityCold, VehicleModel.consumptionCityMild, VehicleModel.consumptionCombCold, VehicleModel.consumptionCombMild, VehicleModel.consumptionHighwayCold, VehicleModel.consumptionHighwayMild from Port inner join UserVehicle on Port.vehicleID = UserVehicle.id inner join VehicleModel on UserVehicle.modelID = VehicleModel.id where Port.id = ${portID};`;
	mysql.query(sql, callback);
}

module.exports. getAllPortInfo = function(callback){
	const sql = `select Port.id as portID, Port.ranking, Port.vehicleID, Port.isCharging, Port.isConnected, UserVehicle.name as vehicleName, UserVehicle.modelID, UserVehicle.soc, UserVehicle.isDoneCharging, UserVehicle.departure, UserVehicle.distance, UserVehicle.route, VehicleModel.brand, VehicleModel.model, VehicleModel.chargeRate, VehicleModel.batteryCap, VehicleModel.consumptionCityCold, VehicleModel.consumptionCityMild, VehicleModel.consumptionCombCold, VehicleModel.consumptionCombMild, VehicleModel.consumptionHighwayCold, VehicleModel.consumptionHighwayMild from Port inner join UserVehicle on Port.vehicleID = UserVehicle.id inner join VehicleModel on UserVehicle.modelID = VehicleModel.id;`;
	mysql.query(sql, callback);
}

module.exports.getVehicleInfo = function(vehicleID, callback){
	const sql = `select * from UserVehicle where id = '${vehicleID}';`;
	mysql.query(sql, callback);
}

module.exports.getModelInfo = function(modelID, callback){
	const sql = `select * from VehicleModel where id = '${modelID}';`;
	mysql.query(sql, callback);
}

module.exports.modifyCharging = function(input, callback){
	const sql = `update Port set isCharging = ${input.isCharging} where id = ${input.portID};`;
	mysql.query(sql, callback);
}

module.exports.modifyConnect = function(input, callback){
	const sql = `update Port set isConnected = ${input.isConnected} where id = ${input.portID};`;
	mysql.query(sql, callback);
}

module.exports.modifySOC = function(input, callback){
	const sql = `update UserVehicle set soc = ${input.soc}, isDoneCharging = ${input.isDoneCharging} where id = (select vehicleID from Port where id = '${input.portID}');`;
	mysql.query(sql, callback);
}