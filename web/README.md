# SmartSwitch-Web
FYDP SmartSwitch Web Application

# Structure Overview
    .
    ├── build                     		# Build files for Apache2
    ├── src                     		# Source files
	│	├── assets						# Assets (SVG, etc.)
	│	├── components					# Components (Utility, helper, etc.)
	│	│	├── jwt.js					# Refresh token
	│	│	├── scrollToTop.js			# Helper to always scroll to top when page changes
	│	├── pages						# Pages (Main, Login, etc.)
	│	│	├── add.js					# Page for adding new vehicle
	│	│	├── home.js					# Home page
	│	│	├── login.js				# Login page
	│	│	├── user.js					# Page for changing user password
	│	│	├── register.js				# Register Page
	│	│	├── modify.js				# Page for modifying the vehicle
	│	├── const						# Constants (Constant variables)
	│	│	├── api.js					# API settings
	│	│	├── const.js				# General constants
	│	├── App.js
	│	├── index.js					# Main HTML page core
    └── README.md

# Tools
- [React] - JavaScript library for web development
- [Material UI] - React component and icons
- [React Router] - React navigational components

[React]: <https://reactjs.org/>
[Material UI]: <https://material-ui.com/zh/>
[React Router]: <https://reactrouter.com/>
