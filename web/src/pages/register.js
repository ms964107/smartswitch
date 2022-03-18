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
import MailIcon from '@material-ui/icons/Mail';

import { register as registerAPI } from '../const/api';
import { validation } from '../const/const';

function Register() {
	const [email, setEmail] = useState('')
	const [user, setUser] = useState('')
	const [newPass, setNewPass] = useState('')
	const [newDulPass, setDulPass] = useState('')
	const [error, setError] = useState(false)

	const history = useHistory();

	sessionStorage.clear()

	function handleSaveOnClick() {
		fetch(registerAPI, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username: user,
				password: newPass,
			})
		}).then(response => response.json())
		.then((data) => {
			if (data.success) {
				history.push('/login')
			} else {
				setError(true)
			}
		}).catch((error) => {
			setError(true)
		});
	}

	function handleUserOnChange(val) {
		if (error) {
			setError(false)
		}
		setUser(val)
	}

	function handleEmailOnChange(val) {
		if (error) {
			setError(false)
		}
		setEmail(val)
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
					<IconButton onClick={() => history.push('/login')}>
						<ArrowBackIcon />
					</IconButton>
				</div>
				<div className="utility">
					<IconButton
						onClick={handleSaveOnClick}
						disabled={newPass !== newDulPass
							|| !email.match(validation.email.rule)
							|| user === ""
							|| newPass.length === 0
							|| !user.match(validation.name.rule)
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
						defaultValue=""
						label="Username"
						variant="outlined"
						required
						onChange={(event) => handleUserOnChange(event.target.value)}
						inputProps={{ maxLength: validation.name.limit }}
						helperText={validation.name.text}
						error={!user.match(validation.name.rule)}
					/>
				</div>
				<div className="input_user password">
					<div className="icon">
						<MailIcon />
					</div>
					<TextField
						className="textfield-password inputAll"
						variant="outlined"
						label="Email"
						type="email"
						required
						onChange={(event) => handleEmailOnChange(event.target.value)}
						helperText={validation.email.text}
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

export default withRouter(Register);
