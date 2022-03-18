import { refreshToken as refreshTokenAPI } from '../const/api';

export const refreshToken = function() {
	return fetch(refreshTokenAPI, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			username: sessionStorage.getItem('user'),
			refreshToken: sessionStorage.getItem('refreshToken'),
		})
	}).then(response => response.json())
}