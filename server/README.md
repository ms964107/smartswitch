# smartswitch-server
FYDP SmartSwitch Server

# Structure Overview
    .
    ├── src                     		# Source files
	│	├── api							# API
	│	│	├── controllers				# Main functionalities of each API (Serve request)
	│	│	│	├── users.js
	│	│	│	├── vehicle.js
	│	│	│	├── jwt.js
	│	│	├── models					# SQL-related functions (SELECT, INSERT)
	│	│	│	├── users.js
	│	│	│	├── vehicle.js
	│	│	├── routes					# Routes only including all HTTP methods
	│	│	│	├── users.js			# User methods (login, register, change password)
	│	│	│	├── vehicle.js
	│	│	│	├── jwt.js
	│	│	├── mysql-config			# MySQL configuration
	│	│	├── passport-config			# Passport configuration
	│	│	├── utility					# Utility function
	│	├── ERROR_CODE.txt				# API error response codebook
	│	├── server.js					# Server config
	│	├── sql
	│	│	├── initialization.sql		# SQL script for initial MySQL setup
	├── .env							# environment settings
    └── README.md

# Instructions
Run the server
`npm run server`
Run MySQL server with initialization (Should only be done once)
`npm run mysql_init` or `brew services start mysql`
Run MySQL server (Should be up  already if initialization is done correctly. If not, manually start the MySQL server)
`npm run mysql` or `mysql.server start`
Connect to MySQL
`npm run login_mysql` or `mysql -u root -p`

# Tools
- [NodeJS] - JavaScript runtime environment
- [ExpressJS] - Backend web application framework 
- [PassportJS] - Authentication middleware for Node.js
- [Bcrypt] - Password-hashing function
- [JWT] - JSON Web Token (JWT) for request authorization
- [MySQL] - MySQL Database Service 
- [PM2] - Advanced process manager for production Node.js applications
- [ApacheHTTP] - Develop and maintain an open-source HTTP server

[NodeJS]: <https://nodejs.org/en/>
[ExpressJS]: <https://expressjs.com/>
[PassportJS]: <http://www.passportjs.org/>
[Bcrypt]: <https://github.com/kelektiv/node.bcrypt.js#readme>
[JWT]: <https://jwt.io/>
[MySQL]: <https://www.mysql.com/>
[PM2]: <https://pm2.keymetrics.io/>
[ApacheHTTP]: <https://httpd.apache.org/>

# Error code
0	- The user does not exist
1	- The user has registered
2	- Username and password do not match
3	- The user is currently authenticated
4	- The user is currently not authenticated
5	- Token is missing
6	- Invalid token
7	- Invalid inputs

9	- Other errors
