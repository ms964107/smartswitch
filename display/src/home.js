import React, { useState, useEffect, useRef } from 'react';
import './home.css';

import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

import tesla_model3 from './image/tesla-model-3.png';
import tesla_models from './image/tesla-model-s.jpeg';
import nissan_leaf from './image/nissan-leaf.jpeg';
import hyundai_ioniq from './image/hyundai-ioniq.jpeg';

function Home() {
	const [data, setData] = useState([])
	const [currentVehicle, setCurrentVehicle] = useState(0)
	const [time, setTime] = useState(getTime());
	const [lock, setLock] = useState(true)
	const [connected, setConnected] = useState(false)
	const [priority, setPriority] = useState(0)
	const [modelList, setModelList] = useState([])

	const API = "http://35.224.217.59:3001/"

	const ref_priority = useRef(priority);
	const ref_lock = useRef(lock);
	const ref_connected = useRef(connected);
	const ref_currentVehicle = useRef(currentVehicle);
	const ref_data= useRef(data);

	const _setConnected = x => {
		ref_connected.current = x;
		setConnected(x);
	};

	const _setLock = x => {
		ref_lock.current = x;
		setLock(x);
	};

	const _setPriority = x => {
		if (!x && x !== 0) {
			x = 'N/A'
		}
		ref_priority.current = x;
		setPriority(x);
	};

	const _setCurrentVehicle = x => {
		ref_currentVehicle.current = x;
		setCurrentVehicle(x);
	};

	const _setData = x => {
		ref_data.current = x;
		setData(x);
		_setPriority(x[ref_currentVehicle.current] ? x[ref_currentVehicle.current].ranking : null)
	};

	function handleUserKeyPress(event) {
		let key = event
		// console.log(key)
		switch(key) {
			case "ArrowUp":
				if (!ref_lock.current) {
					if (ref_priority.current === 'N/A' || (!ref_priority.current && ref_priority.current !== 0)) {
						_setPriority(0)
					} else {
						_setPriority(Math.min(3, ref_priority.current + 1))
					}
				}
				break;
			case "ArrowDown":
				if (!ref_lock.current) {
					if (ref_priority.current === 'N/A' || (!ref_priority.current && ref_priority.current !== 0)) {
						_setPriority(0)
					} else {
						_setPriority(Math.max(0, ref_priority.current - 1))
					}
				}
				break;
			case "ArrowRight":
				if (!ref_lock.current) {
					const min = Math.min(ref_data.current.length - 1, ref_currentVehicle.current + 1)
					_setCurrentVehicle(min)
					// console.log(ref_data.current[min])
					_setPriority(ref_data.current[min].ranking)
				}
				break;
			case "ArrowLeft":
				if (!ref_lock.current) {
					const max = Math.max(0, ref_currentVehicle.current - 1)
					_setCurrentVehicle(max)
					_setPriority(ref_data.current[max].ranking)
				}
				break;
			case "space":
				_setLock(!ref_lock.current)
				if (ref_lock.current) {
					handleSave(ref_data.current[ref_currentVehicle.current])
					if (ref_lock && ref_lock.current) {
						handleLogin()
					}
				}
				break;
			// case "return":
			// 	_setConnected(!ref_connected.current)
			// 	break;
			default:
				break
		}
	}

	useEffect(() => {
		// document.addEventListener("keydown", handleUserKeyPress);
		const ws = new WebSocket('ws://localhost:9898/');
		ws.onopen = function() {
			console.log('WebSocket Client Connected');
			ws.send('WebSocket initiated');
		};
		ws.onmessage = function(e) {
			console.log("Received: '" + e.data + "'");
			handleUserKeyPress(e.data)
		};
		clock()
		// setInterval(() => {
		// 	ws.send("hi")
		// 	console.log('ping')
		// }, 600);
	}, []);

	function clock() {
		setInterval(() => {
			if (ref_lock && ref_lock.current) {
				// _setData(test_1)
				handleLogin()
			}
			setTime(getTime());
		}, 10000);
	}

	function handleSave(car) {
		const timestamp = car.departure.split("T")
		const time = timestamp[1].split(".")
		fetch(API + 'modify', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
			},
			body: JSON.stringify({
				username: sessionStorage.getItem('user'),
				vehicle: {
					id: car.id,
					name: car.name,
					modelID: car.modelID,
					departure: `${timestamp[0]} ${time[0]}`,
					distance: car.distance,
					route: car.route,
					portID: 0,
					startingSoc: car.soc,
					ranking: ref_priority.current === 'N/A' ? 0 : ref_priority.current,
				}
			})
		}).catch((error) => {
			console.log(error)
			// something is wrong
		});
	}

	function handleList() {
		fetch(API + "vehicles", {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
			}
		}).then(response => response.json())
		.then((data) => {
			if (data.success) {
				// setCarList(data.data.vehicleList)
				let carList = data.data.vehicleList
				let index = carList.findIndex(x => x.portID === 0)
				_setCurrentVehicle(index === -1 ? 0 : index)
				setModelList(data.data.modelList)
				_setData(data.data.vehicleList)
			} else {
				throw ""
			}
		}).catch((error) => {
			// something is not right
		});
	}

	function handleLogin() {
		fetch(API + "login", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username: "evse",
				password: "evse",
			})
		}).then((response) => {
			if (!response.ok) {
				throw ""
			} else {
				return response.json()
			}
		}).then((data) => {
			if (data.success) {
				sessionStorage.setItem('user', data.username)
				sessionStorage.setItem('token', data.token)
				sessionStorage.setItem('refreshToken', data.refreshToken)
				handleList()
			}
		}).catch((error) => {
			// something is wrong
		})
	}

	function getTime() {
		const options = {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
		};
		return new Date().toLocaleDateString("en-US", options);
	}

	function renderCarPic() {
		switch(data[currentVehicle] ? data[currentVehicle].modelID : null) {
			case 2:
				return tesla_models
			case 1:
				return tesla_model3
			case 3:
				return nissan_leaf
			case 4:
				return hyundai_ioniq
			default:
				return null
		}
	}

	function renderSOC(curr) {
		let color = ''
		if (curr && curr.isCharging) {
			color = 'charging'
		} else if (curr && curr.isDoneCharging) {
			color = 'charged'
		}

		return (
			<div className={`item_num ${color}`}>
				{curr ? curr.soc + '%' : 'N/A'}
			</div>
		)
	}

	return (
		<div className="Home">
			<div className='head'>
				<div className='time'>
					{time}
				</div>
				{/* <div className={connected ? "charging_status lock" : "charging_status unlock"}>
					{connected ? 'CONNECTED' : 'NOT CONNECTED'}
				</div> */}
				<div className={lock ? "charging_status lock text" : "charging_status unlock text"}>
					{lock ? 'LOCK' : 'UNLOCK'}
				</div>
			</div>
			<div className='info'>
				<div className='basic item'>
					<div className='port'>
						<div className='item_name'>
							Port
						</div>
						<div className='item_num'>
							0
						</div>
					</div>
					<div className='soc'>
						<div className='item_name'>
							SOC
						</div>
						{renderSOC(data[currentVehicle])}
					</div>
				</div>
				<div className='model item'>
					<div className='item_name'>
						Model
					</div>
					<div className='image_wrapper'>
						<img src={renderCarPic()} className='image'></img>
					</div>
					<div className='model_val'>
						{data[currentVehicle] ? modelList[data[currentVehicle].modelID - 1].brand : 'N/A'}
					</div>
					<div className='model_val'>
						{data[currentVehicle] ? modelList[data[currentVehicle].modelID - 1].model : 'N/A'}
					</div>
				</div>
				<div className='priority item'>
					<div className='item_name'>
						Importance
					</div>
					<div className={!lock ? 'settings edit' : 'settings'}>
						<div className='icon_wrapper'>
							<KeyboardArrowUpIcon
								fontSize='large'
								color={!lock ? "action" : "disabled"}
							/>
						</div>
						<div className='item_setting'>
							{priority !== null ? priority : "N/A"}
						</div>
						<div className='icon_wrapper'>
							<KeyboardArrowDownIcon
								fontSize='large'
								color={!lock ? "action" : "disabled"}
							/>
						</div>
					</div>
				</div>
			</div>
			<div className='bottom'>
				<div className={'settings_bot'}>
					<div className='icon_wrapper'>
						<KeyboardArrowLeftIcon
							fontSize='large'
							color={!lock && currentVehicle !== 0 ? "action" : "disabled"}
						/>
					</div>
					<div className='item_setting_bot'>
							{data[currentVehicle] ? data[currentVehicle].name : 'N/A'}
					</div>
					<div className='icon_wrapper'>
						<KeyboardArrowRightIcon
							fontSize='large'
							color={!lock && currentVehicle !== data.length - 1 ? "action" : "disabled"}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Home;
