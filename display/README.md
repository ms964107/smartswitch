# SmartSwitch-Web
FYDP SmartSwitch Web Application on Raspberry Pi Display

480 X 320, 3.5 inch

Space: START/STOP charging

Enter: enter or exit "edit mode"

Up/Down: switch between vehicles (depreciated, we no longer want this)

Up/Down in "edit mode": change values

Left/Right in "edit mode": change the property (priority or target soc) to edit

# Structure Overview
    .
    ├── src                     		# Source files
	│	├── image			# image files for the vehicles
	│	├── const			# Constants (Constant variables)
	│	│	├── test_data.js	# test sample
	│	├── App.js
	│	├── home.js                     # Main page
	│	├── index.js			# Main HTML page core
    └── README.md

# Tools
- [React] - JavaScript library for web development
- [Material UI] - React component and icons

[React]: <https://reactjs.org/>
[Material UI]: <https://material-ui.com/zh/>
