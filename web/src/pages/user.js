import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import './user.css';

import {
	TextField,
	IconButton,
} from '@material-ui/core';

import PersonIcon from '@material-ui/icons/Person';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SaveIcon from '@material-ui/icons/Save';
import LockOpenIcon from '@material-ui/icons/LockOpen';

import { validation } from '../const/const';
import { changePassword as changePasswordAPI } from '../const/api';
import { refreshToken } from '../components/jwt';

function User() {
	const [pass, setPass] = useState('')
	const [newPass, setNewPass] = useState('')
	const [newDulPass, setDulPass] = useState('')
	const [error, setError] = useState(false)

	const history = useHistory();

	function handleSaveOnClick() {
		fetch(changePasswordAPI, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
			},
			body: JSON.stringify({
				username: sessionStorage.getItem('user'),
				old_password: pass,
				new_password: newPass
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
				throw ""
			}
		}).catch((error) => {
			setError(true)
		});
	}

	function handlePassOnChange(val) {
		if (error) {
			setError(false)
		}
		setPass(val)
	}

	function handleNewPassOnChange(val) {
		if (error) {
			setError(false)
		}
		setNewPass(val)
	}

	function handleDulPassOnChange(val) {
		if (error) {
			setError(false)
		}
		setDulPass(val)
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
						disabled={newPass !== newDulPass
							|| newPass.length === 0
							|| pass.length === 0
						}
					>
						<SaveIcon />
					</IconButton>
				</div>
			</div>
			<div className="inputfield">
				<div className="input_user user">
					<div className="icon">
						<PersonIcon />
					</div>
					<TextField
						className="textfield-user inputAll"
						defaultValue={sessionStorage.getItem('user')}
						label="Username"
						variant="outlined"
						disabled
					/>
				</div>
				<div className="input_user password">
					<div className="icon">
						<LockOpenIcon />
					</div>
					<TextField
						className="textfield-password inputAll"
						variant="outlined"
						label="Current Password"
						type="password"
						required
						onChange={(event) => handlePassOnChange(event.target.value)}
						inputProps={{ maxLength: validation.password.limit }}
						helperText={validation.password.text}
					/>
				</div>
				<div className="input_user new-password">
					<div className="icon">
						<LockOpenIcon />
					</div>
					<TextField
						className="textfield-new-password inputAll"
						variant="outlined"
						label="New Password"
						type="password"
						required
						onChange={(event) => handleNewPassOnChange(event.target.value)}
						inputProps={{ maxLength: validation.password.limit }}
						helperText={validation.password.text}
					/>
				</div>
				<div className="input_user new-dulplicate-password">
					<div className="icon">
						<LockOpenIcon />
					</div>
					<TextField
						className="textfield-dul-password inputAll"
						variant="outlined"
						label="Confirm Password"
						required
          				type="password"
						onChange={(event) => handleDulPassOnChange(event.target.value)}
						error={newPass !== newDulPass}
						helperText={newPass !== newDulPass ? "Unmatched Password" : ""}
						inputProps={{ maxLength: validation.password.limit }}
					/>
				</div>
				<div className="input_user warning">
					{error ? "Something is Wrong, Please Try Again" : ""}
				</div>
			</div>
		</div>
	);
}

export default withRouter(User);
