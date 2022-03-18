const express = require("express");
const bodyParser = require("body-parser");

const app = express();

if (process.env.NODE_ENV !== "production") {
	require("dotenv").config({ path: '../.env' })
}

// parse requests of content-type: application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// CORS
const cors = require('cors');
app.use(cors({
	origin: ['http://localhost', 'http://localhost:3000', 'http://35.224.217.59'],
	methods: 'GET, PUT, POST, OPTIONS',
	allowedHeaders: ['Content-Type', 'Authorization'],
}));

// passport
// const flash = require("express-flash")
// const session = require("express-session")
// const passport = require("passport")

// const passportUtility = require('./api/passport-config.js')
const userRoutes = require('./api/routes/user.js')
// passportUtility.initialize(passport)

// app.use(flash())
// app.use(session({
// 	secret: process.env.SESSION_SECRET,
// 	resave: false,
// 	saveUninitialized: false,
// }))
// app.use(passport.initialize())
// app.use(passport.session())

// MySQL
const mysql = require('./api/mysql-config.js')
mysql.initialize()

// routes
const vehicleRoutes = require('./api/routes/vehicle.js')
const tokenRoutes = require('./api/routes/jwt.js')
userRoutes.userAPI(app);
vehicleRoutes.vehicleAPI(app);
tokenRoutes.tokenAPI(app);

// set port, listen for requests
app.listen(process.env.SERVER_PORT);