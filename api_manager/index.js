// DEPENDENCIES
const axios = require('axios');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const moment = require('moment');
const btoa = require('btoa');
const PrettyError = require('pretty-error');
const pe = new PrettyError();
const chalk = require('chalk');
const qs = require('querystring');
const path = require('path');

// ENVIRONMENT
const root_dir = path.resolve(__dirname, '..');
require('dotenv').config({ path: `${root_dir}/.env` });

// CONSTANTS
const token_file = path.resolve(root_dir, 'api_manager/env/spotify_token.json');
const ERR_TYPES = {
	'bad_write': 'WriteError'
}
const SPOTIFY_API_URL = 'https://api.spotify.com/v1';
const TIMEOUT = 5000;
const api_instance = axios.create({
	baseURL: SPOTIFY_API_URL,
	timeout: TIMEOUT
});

// GLOBALS
let current_token = null;

// get access token
const getToken = async () => {
	try {
		await fs.statAsync(token_file);
		return fs.readFileAsync(token_file)
			.then(data => JSON.parse(data))
			.then(token_obj => {
				console.log(chalk.yellow('Got token object: '), JSON.stringify(token_obj));
				// token expired, get new one
				if (moment(token_obj.expiration).isBefore(moment())) return tokenRequest();
				else return Promise.resolve(token_obj);
			});
	} catch (err) {
		console.error(pe.render(err));
		return tokenRequest();
	}
}

// send request to spotify to get a new access token and write to file
function tokenRequest() {
	console.log('Sending token request...');
	return api_instance.request(tokenRequestConfig())
		.then(res => res.data)
		.then(token_obj => {
			token_obj.expiration = moment().add(token_obj.expires_in, 'seconds');
			console.log(chalk.yellow('Got token object: '), JSON.stringify(token_obj));
			return fs.writeFileAsync(token_file, JSON.stringify(token_obj))
				.then(() => token_obj);
		})
		.catch(err => {
			console.error(pe.render(err));
			if (err.response) {
				// The request was made and the server responded with a status code
				// that falls out of the range of 2xx
				console.error(err.response.data);
				console.error(err.response.status);
				console.error(err.response.headers);
			}
			return Promise.reject('Token request failed');
		});
}

// config for token request
function tokenRequestConfig() {
	const auth_header = btoa(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`);
	return {
		url: 'https://accounts.spotify.com/api/token',
		method: 'post',
		headers: {
			'Authorization': `Basic ${auth_header}`,
			'content-type': 'application/x-www-form-urlencoded',
		},
		data: qs.stringify({
			grant_type: 'client_credentials'
		})
	};
}

// interceptor to add token to the beginning of all requests
const interceptor = async (request) => {
	if(api_instance.token_obj) {
		const token_obj = api_instance.token_obj;
		api_instance.token_obj = await moment(token_obj.expiration).isBefore(moment()) ? tokenRequest() : token_obj;
		request.headers.Authorization = `Bearer ${api_instance.token_obj.access_token}`;
	}
	console.log(`${request.method.toUpperCase()}`, chalk.yellow(request.url));
	return request;
}

// export an api_instance with valid spotify token and request interceptor (to refresh token as needed)
module.exports = (() => {
	console.log(chalk.yellow('Setting up Spotify api instance...'));
	return getToken()
		.then(token_obj => {
			api_instance.token_obj = token_obj;
			api_instance.interceptors.request.use(interceptor);
			console.log(chalk.green('✔ Spotify api instance ready'))
			return Promise.resolve(api_instance);
		});
})();