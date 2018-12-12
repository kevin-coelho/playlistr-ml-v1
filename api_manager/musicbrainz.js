const axios = require('axios');
const axiosRetry = require('axios-retry');
const Promise = require('bluebird');
const PrettyError = require('pretty-error');
const pe = new PrettyError();
const chalk = require('chalk');

// MODULE DEPS
const { sleep } = require('../utils');

// CONSTANTS
const TIMEOUT = 8000; // ms
const RETRY_SLEEP = 1000; // ms
const MUSICBRAINZ_API_URL = 'https://musicbrainz.org/ws/2';

const api_instance = axios.create({
	baseURL: MUSICBRAINZ_API_URL,
	timeout: TIMEOUT
});

const user_agent_string = 'Playlistr/0.0.1 ( https://www.kevincoelho.com/ )';

axiosRetry(api_instance, {
	retries: 3,
	retryDelay: (retryCount) => {
		console.log(`Axios request fail. Retrying... [${chalk.red(retryCount)}]`);
		return axiosRetry.exponentialDelay;
	},
	shouldResetTimeout: true,
});

// interceptor to add token to the beginning of all requests
/** Interceptor to add:
 *
 * 	Headers:
 *
 * 	Auth 			Bearer [...]
 * 	User-Agent 		Playlistr/0.0.1 ( https://www.kevincoelho.com/ )
 *
 */
const req_interceptor = (request) => {
	request.headers['User-Agent'] = api_instance.user_agent;
	console.log(`${request.method.toUpperCase()}`, chalk.yellow(request.url || request.baseURL));
	console.log(request);
	return request;
};

const res_interceptor = (response) => {
	return Promise.resolve(response.data);
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
		if (err.response.status == 503) {
			console.log(`API Rate limiter. ${chalk.yellow('Retrying...')}`);
			return sleep(RETRY_SLEEP)
				.then(() => api_instance.request(err.config));
		}
		if (err.response.status === 408 || err.code === 'ECONNABORTED') {
			console.log(`Timeout. ${chalk.yellow('Retrying...')}`);
			return sleep(RETRY_SLEEP)
				.then(() => api_instance.request(err.config));
		}
	} else {
		console.error(chalk.red('Network error occurred. Check the connection.'));
	}
	return Promise.reject(err);
};

console.log(chalk.yellow('Setting up MusicBrainz api instance...'));
api_instance.user_agent = user_agent_string;
api_instance.interceptors.request.use(req_interceptor);
api_instance.interceptors.response.use(res_interceptor, res_err_interceptor);
console.log(chalk.green('✔ MusicBrainz api instance ready'));
module.exports = api_instance;
