import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { validation, totalPort, routes } from '../const/const'
import './modify.css';

import {
	TextField,
	IconButton,
	InputAdornment,
	Select,
	MenuItem,
	InputLabel,
	FormControl
} from '@material-ui/core';

import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import PersonIcon from '@material-ui/icons/Person';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SaveIcon from '@material-ui/icons/Save';
import RoomIcon from '@material-ui/icons/Room';
import FaceIcon from '@material-ui/icons/Face';
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';
import TimerIcon from '@material-ui/icons/Timer';
import DepartureBoardIcon from '@material-ui/icons/DepartureBoard';
import FormatAlignJustifyIcon from '@material-ui/icons/FormatAlignJustify';
import EvStationIcon from '@material-ui/icons/EvStation';
import EventIcon from '@material-ui/icons/Event';
import TimelineIcon from '@material-ui/icons/Timeline';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import BatteryFullIcon from '@material-ui/icons/BatteryFull';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { modifyVehicle as modifyVehicleAPI } from '../const/api';
import { refreshToken } from '../components/jwt';

function Modify() {
	const history = useHistory();
	const modelList = history.location.state.modelList
	const car = history.location.state.vehicle
	const brands = Array.from(new Set(modelList.map(x => x.brand)))
	const currentModel = modelList.find(x => x.id === car.modelID);

	const [name, setName] = useState(car.name)
	const [brand, setBrand] = useState(currentModel.brand)
	const [model, setModel] = useState(currentModel.model)
	const [route, setRoute] = useState(car.route)
	const [distance, setDistance] = useState(car.distance)
	const [port, setPort] = useState(car.portID)
	const [departure, setDeparture] = useState(getTime(true, car.departure));
	const [error, setError] = useState(false)
	const [importance, setImportance] = useState(car.ranking)
	const [startingSoc, setStartingSoc] = useState(car.soc)
	const [startingSocError, setStartingSocError] = useState(false)
	const [distanceError, setDistanceError] = useState(false)

	// get current time
	function getTime(decode = false, departure = null, reset = false) {
		let date = new Date()
		if (decode) {
			const originalDeparture = new Date(departure)
			if (originalDeparture < date) {
				reset = true
			} else {
				date = originalDeparture
			}
		}
		const year = date.getFullYear()
		let month = date.getMonth() + 1
		month = month < 10 ? `0${month}` : month
		let _date = date.getDate()
		_date = _date < 10 ? `0${_date}` : _date
		let hour = date.getHours() + (reset ? 1 : 0)
		hour = hour < 10 ? `0${hour}` : hour
		let minute = date.getMinutes()
		minute = minute < 10 ? `0${minute}` : minute
		
		return `${year}-${month}-${_date}T${hour}:${minute}`
	}

	function handleDistanceOnChange(event) {
		let val = event.target.value
		if (val.match(/^[1-9][0-9]*$/) === null) {
			setDistanceError(true)
			setDistance(val)
		} else {
			setDistanceError(false)
			const distance = parseInt(event.target.value, 10)
			setDistance(Math.min(distance, maxDistance()))
		}
	}

	function handleStartingSOCOnChange(soc) {
		if (soc.match(/^[1-9][0-9]*$/) === null) {
			setStartingSocError(true)
			setStartingSoc(soc)
		} else {
			setStartingSocError(false)
			const s = parseInt(soc, 10)
			setStartingSoc(Math.min(s, 100))
		}
	}

	function handleSaveOnClick() {
		const timestamp = departure.split("T")
		fetch(modifyVehicleAPI, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
			},
			body: JSON.stringify({
				username: sessionStorage.getItem('user'),
				vehicle: {
					id: car.id,
					name: name,
					modelID: findVehicleModel().id,
					departure: `${timestamp[0]} ${timestamp[1]}:00`,
					distance: distance,
					route: route,
					portID: port,
					startingSoc: startingSoc,
					ranking: importance
				}
			})
		}).then(response => response.json())
		.then((data) => {
			if (data.success) {
				history.push('/home')
			} else if (data.invalidToken) {
				refreshToken().then((data) => {
					if (data.success) {
						sessionStorage.setItem('token', data.token)
						handleSaveOnClick()
					} else {
						throw ""
					}
				}).catch((error) => {
					history.push('/')
				});
			} else {
				setError(true)
			}
		}).catch((error) => {
			setError(true)
		});
	}

	function findVehicleModel() {
		return modelList.find(x => x.brand === brand && x.model === model);
	}

	function maxDistance() {
		if (modelList.length === 0 || brand === '' || model === '' || route === '') {
			return 0
		}
		const vehicle = findVehicleModel();
		if (route === 'urban') {
			return vehicle.consumptionCityCold
		} else if (route === 'combined') {
			return vehicle.consumptionCombCold
		} else {
			return vehicle.consumptionHighwayCold
		}
	}

	return (
		<div className="Add">
			<div className="title">
				SmartSwitch
			</div>
			<div className="menu-bar-add">
				<div className="go-back">
					<IconButton onClick={() => history.push('/home')}>
						<ArrowBackIcon />
					</IconButton>
				</div>
				<div className="utility">
					<IconButton
						onClick={handleSaveOnClick}
						disabled={name === ""
							|| !name.match(validation.name.rule)
							|| brand === ""
							|| model === ""
							|| route === ""
							|| (!port && port !== 0)
							|| (!importance && importance !== 0)
							|| distanceError
							|| startingSocError
						}
					>
						<SaveIcon />
					</IconButton>
				</div>
			</div>
			<div className="inputfield">
				<div className="input name">
					<div className="icon">
						<FaceIcon />
					</div>
					<TextField
						className="textfield-name inputAll"
						label="Name"
						variant="outlined"
						value={name}
						onChange={(event) => setName(event.target.value)}
						inputProps={{ maxLength: validation.name.limit }}
						helperText={validation.name.text}
						error={!name.match(validation.name.rule)}
					/>
				</div>
				<div className="input">
					<div className="icon">
						<DirectionsCarIcon />
					</div>
					<FormControl variant="outlined" className="brand">
						<InputLabel id="select-brand-label">Brand</InputLabel>
						<Select
							label="brand"
							value={brand}
							onChange={(event) => {
								setBrand(event.target.value)
								setModel('')
							}}
							className="select-brand inputAll"
							labelId="Brand"
						>
							{brands.map(x => {
								return (
									<MenuItem value={x}>{x}</MenuItem>
								)
							})}
						</Select>
					</FormControl>
				</div>
				<div className="input">
					<div className="icon">
						<DirectionsCarIcon />
					</div>
					<FormControl variant="outlined" className="model" disabled={brand === ''}>
						<InputLabel id="select-model-label">Model</InputLabel>
						<Select
							label="model"
							value={model}
							onChange={(event) => setModel(event.target.value)}
							className="select-model inputAll"
							labelId="Model"
						>
							{modelList.filter(x => x.brand === brand).map(x => {
								return (
									<MenuItem value={x.model}>{x.model}</MenuItem>
								)
							})}
						</Select>
					</FormControl>
				</div>
				<div className="input">
					<div className="icon">
						<TimelineIcon />
					</div>
					<FormControl variant="outlined" className="route">
						<InputLabel id="select-model-label">Route</InputLabel>
						<Select
							label="route"
							value={route}
							onChange={(event) => setRoute(event.target.value)}
							className="select-model inputAll"
							labelId="Route"
						>
							{routes.map(x => {
								return (
									<MenuItem value={x}>{x}</MenuItem>
								)
							})}
						</Select>
					</FormControl>
				</div>
				<div className="input distance">
					<div className="icon">
						<FormatAlignJustifyIcon />
					</div>
					<TextField
						className="textfield-distance inputAll"
						label="Distance (KM)"
						variant="outlined"
						type="number"
						disabled={brand === '' || model === '' || route === ''}
						onChange={(event) => handleDistanceOnChange(event)}
						value={distance}
						error={distanceError}
						helperText={brand === '' || model === '' || route === '' ? "Please select vehicle info first" : "Maximum: " + maxDistance() + "KM"}
					/>
				</div>
				<div className="input port">
					<div className="icon">
						<EvStationIcon />
					</div>
					<FormControl variant="outlined" className="port">
						<InputLabel id="select-port-label">Port</InputLabel>
						<Select
							label="port"
							value={port}
							onChange={(event) => setPort(event.target.value)}
							className="select-port inputAll"
							labelId="Port"
						>
							<MenuItem value={0}>0</MenuItem>
							<MenuItem value={1}>1</MenuItem>
							<MenuItem value={2}>2</MenuItem>
							<MenuItem value={3}>3</MenuItem>
						</Select>
					</FormControl>
				</div>
				<div className="input importance">
					<div className="icon">
						<PriorityHighIcon />
					</div>
					<FormControl variant="outlined" className="importance">
						<InputLabel id="select-importance-label">Importance</InputLabel>
						<Select
							label="importance"
							value={importance}
							onChange={(event) => setImportance(event.target.value)}
							className="select-importance inputAll"
							labelId="Importance"
						>
							<MenuItem value={0}>0 (High)</MenuItem>
							<MenuItem value={1}>1</MenuItem>
							<MenuItem value={2}>2</MenuItem>
							<MenuItem value={3}>3 (Low)</MenuItem>
						</Select>
					</FormControl>
				</div>
				<div className="input startingSoc">
					<div className="icon">
						<BatteryFullIcon />
					</div>
					<TextField
						className="textfield-startingSoc inputAll"
						label="Starting Soc"
						variant="outlined"
						type="number"
						error={startingSocError}
						onChange={(event) => handleStartingSOCOnChange(event.target.value)}
						value={startingSoc}
						helperText="Maximum: 100%"
					/>
				</div>
				<div className="input date">
					<div className="icon">
						<EventIcon />
					</div>
					<TextField
						className="textfield-time inputAll"
						label="Time of Travel"
						variant="outlined"
						type="datetime-local"
						defaultValue={departure}
						inputProps={{
							min: getTime(null, null, true)
						}}
						onChange={(event) => setDeparture(event.target.value)}
					/>
				</div>
			</div>
		</div>
	);
}

export default withRouter(Modify);
