const axios = require('axios');
const axiosRetry = require('axios-retry');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const moment = require('moment');
const btoa = require('btoa');
const PrettyError = require('pretty-error');
const pe = new PrettyError();
const chalk = require('chalk');
const qs = require('query-string');
const path = require('path');

// MODULE DEPS
const { sleep } = require('../utils');

// CONSTANTS
const TIMEOUT = 8000; // ms
const RETRY_SLEEP = 500; // ms
const EXPIRATION_PADDING = 60; // seconds
const RETRY_LIMIT = 3;
const { token_dir } = require('./constants');
const token_file = path.join(token_dir, 'spotify_token.json');
const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

const api_instance = axios.create({
	baseURL: SPOTIFY_API_URL,
	timeout: TIMEOUT
});

axiosRetry(api_instance, {
	retries: 3,
	retryDelay: (retryCount) => {
		console.log(`Axios request fail. Retrying... [${chalk.red(retryCount)}]`);
		return axiosRetry.exponentialDelay;
	},
	shouldResetTimeout: true,
});

let retries = 0;

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
				return Promise.resolve(token_obj);
			});
	} catch (err) {
		console.error(pe.render(err));
		return tokenRequest();
	}
};

// send request to spotify to get a new access token and write to file
function tokenRequest() {
	console.log('Sending token request...');
	const config = tokenRequestConfig();
	console.log('Token request config: ', config);
	return axios.request(config)
		.then(res => res.data)
		.then(token_obj => {
			token_obj.expiration = moment().add(token_obj.expires_in - EXPIRATION_PADDING, 'seconds');
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
			} else {
				console.error(chalk.red('Network error occurred. Check the connection.'));
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
/** Interceptor to add:
 *
 * 	Headers:
 * 	Auth 			Bearer [...]
 */
const req_interceptor = (request) => {
	if (api_instance.token_obj) {
		const token_obj = api_instance.token_obj;
		if (moment(token_obj.expiration).isBefore(moment())) {
			return tokenRequest()
				.then(token_obj => {
					api_instance.token_obj = token_obj;
					request.headers.Authorization = `Bearer ${api_instance.token_obj.access_token}`;
					return api_instance.request(request);
				});
		}
		request.headers.Authorization = `Bearer ${api_instance.token_obj.access_token}`;
	}
	console.log(`${request.method.toUpperCase()}`, chalk.yellow(request.url || request.baseURL));
	return request;
};

const res_interceptor = (response) => {
	return Promise.resolve(response.data);
};

const retryTokenAuth = () => {
	return tokenRequest()
		.then(token_obj => {
			api_instance.token_obj = token_obj;
		});	
};

// interceptor to print response errors
const res_err_interceptor = (err) => {
	console.error(chalk.red(`[${err.config.url}] Error response received`));
	console.error(pe.render(err));
	if (err.response) {
		// The request was made and the server responded with a status code
		// that falls out of the range of 2xx
		console.error(err.response.data);
		console.error(err.response.status);
		console.error(err.response.headers);
		if (err.response.status == 429 && err.response.headers['retry-after']) {
			if (retries < RETRY_LIMIT) {
				console.log(`API Rate limiter. ${chalk.yellow('Retrying...')}`);
				retries = retries + 1;
				return sleep(err.response.headers['retry-after'] * 1000 + RETRY_SLEEP)
					.then(() => api_instance.request(err.config));
			}
		}
		if (err.response.status === 408 || err.code === 'ECONNABORTED') {
			console.log(`Timeout. ${chalk.yellow('Retrying...')}`);
			return sleep(RETRY_SLEEP)
				.then(() => api_instance.request(err.config));
		}		
		if (err.response.status == 401 
			&& (err.response.data.error.message == 'Invalid access token'
			|| err.response.data.error.message == 'The access token expired')) {
			console.log(chalk.yellow('Invalid access token. Retrying...'));
			return retryTokenAuth()
				.then(() => sleep(RETRY_SLEEP))
				.then(() => api_instance.request(err.config));
		}
	} else {
		console.error(chalk.red('Network error occurred. Check the connection.'));
	}
	return Promise.reject(err);
};

// export an api_instance with valid spotify token and request interceptor (to refresh token as needed)
module.exports = (() => {
	console.log(chalk.yellow('Setting up Spotify api instance...'));
	return getToken()
		.then(token_obj => {
			api_instance.token_obj = token_obj;
			api_instance.interceptors.request.use(req_interceptor);
			api_instance.interceptors.response.use(res_interceptor, res_err_interceptor);
			console.log(chalk.green('✔ Spotify api instance ready'));
			return Promise.resolve(api_instance);
		});
})();