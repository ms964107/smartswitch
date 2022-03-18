const mysql = require('../mysql-config.js')

module.exports.insertNewUser = function(user, callback){
	const sql = `insert into User (username, password) values ('${user.username}', '${user.password}');`;
	mysql.query(sql, callback);
}

module.exports.selectUser = function(username, callback){
	const sql = `select * from User where username='${username}';`;
	mysql.query(sql, callback);
}

module.exports.updateNewToken = function(username, refreshToken, callback){
	const sql = `update User set refreshToken = '${refreshToken}' where username='${username}';`;
	mysql.query(sql, callback);
}

module.exports.changePassword = function(user, callback){
	const sql = `update User set password = '${user.password}' where username='${user.username}';`;
	mysql.query(sql, callback);
}

module.exports.getECOandLocation = function(callback){
	const sql = `select * from config;`;
	mysql.query(sql, callback);
}

module.exports.changeECOorLocation = function(type, value, callback){
	const sql = `update config set value = ${value} where type ='${type}';`;
	mysql.query(sql, callback);
}

module.exports.getLocationList = function(callback){
	const sql = `select * from Location;`;
	mysql.query(sql, callback);
}
