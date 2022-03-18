import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { validation } from '../const/const'
import './home.css';

import {
	TextField,
	IconButton,
	InputAdornment,
	Select,
	MenuItem,
} from '@material-ui/core';

import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import PersonIcon from '@material-ui/icons/Person';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import EcoIcon from '@material-ui/icons/Eco';
import FaceIcon from '@material-ui/icons/Face';
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';
import TimerIcon from '@material-ui/icons/Timer';
import EvStationIcon from '@material-ui/icons/EvStation';
import DepartureBoardIcon from '@material-ui/icons/DepartureBoard';
import FormatAlignJustifyIcon from '@material-ui/icons/FormatAlignJustify';
import TimelineIcon from '@material-ui/icons/Timeline';
import Battery30Icon from '@material-ui/icons/Battery30';
import Battery50Icon from '@material-ui/icons/Battery50';
import Battery80Icon from '@material-ui/icons/Battery80';
import BatteryFullIcon from '@material-ui/icons/BatteryFull';
import BatteryCharging30Icon from '@material-ui/icons/BatteryCharging30';
import BatteryCharging50Icon from '@material-ui/icons/BatteryCharging50';
import BatteryCharging80Icon from '@material-ui/icons/BatteryCharging80';
import BatteryChargingFullIcon from '@material-ui/icons/BatteryChargingFull';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';

import {
	vehicleList as vehicleListAPI,
	deleteVehicle as deleteVehicleAPI,
	locationList as locationListAPI,
	config as configAPI,
	configInfo as configInfoAPI
} from '../const/api';
import { refreshToken } from '../components/jwt';

function Home() {
	const [search, setSearch] = useState('')
	const [location, setLocation] = useState("Waterloo")
	const [locationCode, setLocationCode] = useState(0)
	const [eco, setEco] = useState(false)
	const [time, setTime] = useState(getTime());
	const [refetch, setRefetch] = useState(false)
	const [carList, setCarList] = useState([])
	const [modelList, setModelList] = useState([])
	const [locations, setLocations] = useState([])
	const [error, setError] = useState(false)

	const history = useHistory();

	useEffect(() => {
		fetch(vehicleListAPI, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
			}
		}).then(response => response.json())
		.then((data) => {
			if (data.success) {
				setCarList(data.data.vehicleList)
				setModelList(data.data.modelList)
			} else if (data.invalidToken) {
				refreshToken().then((data) => {
					if (data.success) {
						sessionStorage.setItem('token', data.token)
						setRefetch(!refetch)
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
	}, [refetch]);

	useEffect(() => {
		fetch(locationListAPI, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
			},
			body: JSON.stringify({
				username: sessionStorage.getItem('user'),
			})
		}).then(response => response.json())
		.then((data) => {
			if (data.success) {
				setLocations(data.data)
				setLocation(data.data.find(x => x.id === locationCode))
			} else if (data.invalidToken) {
				refreshToken().then((data) => {
					if (data.success) {
						sessionStorage.setItem('token', data.token)
						setRefetch(!refetch)
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
			console.log(error)
			setError(true)
		});
	}, [refetch]);

	useEffect(() => {
		fetch(configInfoAPI, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
			},
			body: JSON.stringify({
				username: sessionStorage.getItem('user'),
			})
		}).then(response => response.json())
		.then((data) => {
			if (data.success) {
				let target_location = data.data.find(x => x.type === "location")
				setLocationCode(target_location.value)
				let target_eco = data.data.find(x => x.type === "eco")
				setEco(target_eco.value === 0 ? false : true)
			} else if (data.invalidToken) {
				refreshToken().then((data) => {
					if (data.success) {
						sessionStorage.setItem('token', data.token)
						setRefetch(!refetch)
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
	}, [refetch]);

	function handleEcoOnClick() {
		fetch(configAPI, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
			},
			body: JSON.stringify({
				username: sessionStorage.getItem('user'),
				type: "ECO",
				value: eco ? 0 : 1
			})
		}).then(response => response.json())
		.then((data) => {
			if (data.success) {
				setEco(!eco)
			} else if (data.invalidToken) {
				refreshToken().then((data) => {
					if (data.success) {
						sessionStorage.setItem('token', data.token)
						handleEcoOnClick()
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

	function handleLocationOnClick(event) {
		fetch(configAPI, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
			},
			body: JSON.stringify({
				username: sessionStorage.getItem('user'),
				type: "Location",
				value: event
			})
		}).then(response => response.json())
		.then((data) => {
			if (data.success) {
				setLocationCode(event)
				setLocation(locations.find(x => x.id === event).name)
			} else if (data.invalidToken) {
				refreshToken().then((data) => {
					if (data.success) {
						sessionStorage.setItem('token', data.token)
						handleEcoOnClick()
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

	function departureDecode(departure) {
		const options = {
			month: "long",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
		};
		let departureTime = new Date(departure)
		departureTime = new Date(departureTime.setMinutes(departureTime.getMinutes() + new Date().getTimezoneOffset()))
		return new Date() >= departureTime ? "N/A" : departureTime.toLocaleDateString("en-US", options)
	}

	// get current time
	function getTime() {
		const options = {
			year: "numeric",
			month: "numeric",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
		};
		return new Date().toLocaleDateString("en-US", options);
	}

	function clock() {
		setInterval(() => {
			setTime(getTime());
		}, 60000);
		const temp = time.split(",")
		return (
			<div>
				{time}
			</div>
		);
	}

	function getBatteryIcon(car) {
		if (car.isCharging) {
			if (car.soc === 100) {
				return <BatteryChargingFullIcon/>
			} else if (car.soc >= 80) {
				return <BatteryCharging80Icon/>
			} else if (car.soc >= 50) {
				return <BatteryCharging50Icon/>
			} else {
				return <BatteryCharging30Icon/>
			}
		} else {
			if (car.soc === 100) {
				return <BatteryFullIcon/>
			} else if (car.soc >= 80) {
				return <Battery80Icon/>
			} else if (car.soc >= 50) {
				return <Battery50Icon/>
			} else {
				return <Battery30Icon/>
			}
		}
	}

	function getChargingStatus(car) {
		let status = "";
		// if (!car.isTravelling) {
		// 	if (!car.isCharging && car.targetSoc > car.soc) {
		// 		status = "waiting"
		// 	} else if (car.targetSoc <= car.soc) {
		// 		status = "charged"
		// 	} else {
		// 		status = "charging"
		// 	}
		// }

		if (car.isDoneCharging) {
			status = "charged"
		}

		let soc = car.soc + "%";
		if (!car.soc && car.soc !== 0) {
			soc = "N/A"
			status = ""
		}

		return (
			<div className = {"vehicle_text soc " + status}>
				{soc}
			</div>
		);
	}

	function getBrandAndModel(car) {
		if (modelList.length === 0) {
			return ""
		}
		const target = modelList.find(x => x.id === car.modelID)
		return target.brand + " " + target.model
	}

	// Search function filters the car
	function searchFilter(list) {
		return list.filter(car => {
			let requirement = search.toLowerCase()
			let brandAndModel = getBrandAndModel(car)
			return car.name.toLowerCase().includes(requirement) ||
				brandAndModel.toLowerCase().includes(requirement)
		})
	}

	function handleModifyOnClick(car) {
		history.push({ 
			pathname: '/modify',
			state: { vehicle: car, modelList: modelList }
		})
	}

	function handleDeleteOnClick(car) {
		fetch(deleteVehicleAPI, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
			},
			body: JSON.stringify({
				username: sessionStorage.getItem('user'),
				vehicleID: car.id,
				portID: car.portID
			})
		}).then(response => response.json())
		.then((data) => {
			if (data.success) {
				setRefetch(!refetch)
			} else if (data.invalidToken) {
				refreshToken().then((data) => {
					if (data.success) {
						sessionStorage.setItem('token', data.token)
						handleDeleteOnClick()
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

	// render the list of user vehicles
	function renderLists() {
		const list = searchFilter(carList)
		return list.map((car, index) => {
			return (
				<div className={"vehicle_ " + index} key={index}>
					<div className="vehicle_name_soc vehicle_entry">
						<div className="vehicle_name">
							<FaceIcon/>
							<div className="vehicle_text">
								{car.name}
							</div>
						</div>
						<div>
							<EvStationIcon/>
							<div className = {"vehicle_text soc portID"}>
								{!car.portID && car.portID !== 0 ? "N/A" : car.portID}
							</div>
							{getBatteryIcon(car)}
							{getChargingStatus(car)}
						</div>
					</div>
					<div className="vehicle_brand vehicle_entry">
						<DirectionsCarIcon/>
						<div className="vehicle_text">
							{getBrandAndModel(car)}
						</div>
					</div>
					<div className="vehicle_detail vehicle_entry">
						<DepartureBoardIcon/>
						<div className="vehicle_text">
							{"Departure: " + departureDecode(car.departure)}
						</div>
					</div>
					<div className="vehicle_detail vehicle_entry">
						<FormatAlignJustifyIcon/>
						<div className="vehicle_text">
							{"Distance: " + car.distance + " KM"}
						</div>
					</div>
					<div className="vehicle_detail vehicle_entry">
						<TimelineIcon/>
						<div className="vehicle_text">
							{"Route: " + car.route}
						</div>
					</div>
					<div className="vehicle_detail vehicle_entry">
						<PriorityHighIcon/>
						<div className="vehicle_text">
							{"Importance: " + (car.ranking < 4 && car.ranking >= 0 && car.ranking !== null ? car.ranking : "N/A")}
						</div>
					</div>
					{/* <div className="vehicle_charging vehicle_entry">
						<TimerIcon/>
						<div className="vehicle_text">
							Charge Time Remaining: 10:25
						</div>
					</div> */}
					<div className="vehicle_actions">
						<IconButton>
							<CreateIcon onClick={() => handleModifyOnClick(car)}/>
						</IconButton>
						<IconButton>
							<DeleteIcon onClick={() => handleDeleteOnClick(car)}/>
						</IconButton>
					</div>
				</div>
			);
		})
	}

	return (
		<div className="Home">
			<div className="title">
				SmartSwitch
			</div>
			<div className='time'>
				{clock()}
			</div>
			<div className="utility-home">
				{/* <div className="location">
					<Select
						value={locationCode}
						onChange={(event) => handleLocationOnClick(event.target.value)}
						className="location-select"
						labelId="Location"
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon/>
								</InputAdornment>
							),
						}}
					>
						{locations.map(x => {
							return (
								<MenuItem value={x.id}>{x.name}</MenuItem>
							)
						})}
					</Select>
				</div> */}
				{/* <div className="eco-setting">
					<IconButton 
						onClick={handleEcoOnClick}
						className={eco ? "eco-setting-green" : "eco-setting-none"}
					>
						<EcoIcon />
					</IconButton>
				</div> */}
				<div className="search_time">
					<div className="search">
						<TextField
							className="vehicle-search"
							label="Search"
							onChange={(event) => setSearch(event.target.value)}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<SearchIcon/>
									</InputAdornment>
								),
								maxLength: validation.name.limit
							}}
						/>
					</div>
				</div>
				<div className="user-info">
					<IconButton onClick={() => history.push('/user')}>
						<PersonIcon />
					</IconButton>
				</div>
				<div className="add-vehicle">
					<IconButton onClick={() => {history.push({ 
						pathname: '/add',
						state: modelList
					})}}>
						<AddIcon />
					</IconButton>
				</div>
			</div>
			<div className="lists">
				<div className="vehicle_ list_label"></div>
				{renderLists()}
			</div>
		</div>
	);
}

export default withRouter(Home);
