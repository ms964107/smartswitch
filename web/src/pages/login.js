import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import './login.css';

import { TextField, Button } from '@material-ui/core';

import { login as loginAPI } from '../const/api';
import { validation } from '../const/const';
import logo from '../assests/logo.jpeg'

function Login() {
	const [password, setPassword] = useState('')
	const [account, setAccount] = useState('')
	const [error, setError] = useState(false)

	const history = useHistory();

	sessionStorage.clear()

	function handleAccountOnChange(val) {
		if (error) {
			setError(false)
		}
		setAccount(val)
	}

	function handlePasswordOnChange(val) {
		if (error) {
			setError(false)
		}
		setPassword(val)
	}

	function handleLogin() {
		fetch(loginAPI, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username: account,
				password: password,
			})
		}).then((response) => {
			if (!response.ok) {
				throw ""
			} else {
				return response.json()
			}
		})
		.then((data) => {
			if (data.success) {
				sessionStorage.setItem('user', data.username)
				sessionStorage.setItem('token', data.token)
				sessionStorage.setItem('refreshToken', data.refreshToken)
				history.push('/home')
			} else {
				setError(true)
			}
		}).catch((error) => {
			setError(true)
		})
	}

	function handleRegister() {
		history.push('/register')
	}

	return (
		<div className="Login">
			<div className="logo-wrapper">
				<img src={logo} className="logo"/>
			</div>
			<div className="login_title">
				SmartSwitch
			</div>
			<div className="headline">
				A global-leading technology for smart vehicle charging
			</div>
			<div className="inputfield-login">
				<div className="input-login account">
					<TextField
						className="textfield-account inputAll-login"
						label="User Name"
						onChange={(event) => handleAccountOnChange(event.target.value)}
						inputProps={{ maxLength: validation.name.limit }}
						error={error}
					/>
				</div>
				<div className="input-login password">
					<TextField
						className="textfield-password inputAll-login"
						label="Password"
						onChange={(event) => handlePasswordOnChange(event.target.value)}
						inputProps={{ maxLength: validation.password.limit }}
						error={error}
						type="password"
					/>
				</div>
				<div className="login-button-wrapper">
					<Button
						variant="contained"
						onClick={handleLogin}
						disabled={password.length === 0
							|| !account.match(validation.name.rule)
						}
						className={(password.length === 0
							|| !account.match(validation.name.rule)
							) ? "login-button" : "login-button background-color-button"}
					>
						Login
					</Button>
				</div>
				<div className="register-wrapper">
					<div className="no-account">
						Don't have an account?
					</div>
					<div className="register-button-wrapper">
						<Button variant="contained" onClick={handleRegister}>
							SIGN UP
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default withRouter(Login);
