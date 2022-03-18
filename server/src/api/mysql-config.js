const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../../.env') })

var con;

module.exports.initialize = function(){
	var mysql = require('mysql');
	con = mysql.createConnection({
		host: process.env.MYSQL_HOSTNAME,
		user: process.env.MYSQL_USER,
		password: process.env.MYSQL_PASSWORD,
		database: process.env.MYSQL_DATABASE,
		multipleStatements: true
	});
	con.connect(function(error) {
		console.log("MySQL: " + (error ? "cannot connect!" : "connect!"));
	});
}

module.exports.query = function(sql, callback) {
	con.query(sql, function (error, result) {
		callback(error, result); 
	})
};