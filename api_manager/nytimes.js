// DEPENDENCIES
const axios = require('axios');
const axiosRetry = require('axios-retry');
const Promise = require('bluebird');
const PrettyError = require('pretty-error');
const pe = new PrettyError();
const chalk = require('chalk');

// MODULE DEPS
const { sleep } = require('./utils');

// CONSTANTS
const TIMEOUT = 60000;
const REQ_DELAY = 150;
const NYT_ARCHIVE_URL = 'https://api.nytimes.com/svc/archive/v1/';
const NYT_SEARCH_URL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
const NYT_API_URL = NYT_SEARCH_URL;

const api_instance = axios.create({
	baseURL: NYT_API_URL,
	timeout: TIMEOUT,
});
Object.assign(api_instance.defaults, {params: {'api-key': `${process.env.NYTIMES_API_KEY}`}});

axiosRetry(api_instance, {
	retries: 3,
	retryDelay: axiosRetry.exponentialDelay,
	shouldResetTimeout: true,
});

// interceptor to add token to the beginning of all requests
const req_interceptor = async (request) => {
	await sleep(REQ_DELAY);
	console.log(request);
	console.log(`${request.method.toUpperCase()}`, chalk.yellow(request.url || request.baseURL));
	return request;
};

const res_interceptor = async (response) => {
	return Promise.resolve(response.data);
};

// interceptor to print response errors
const res_err_interceptor = async (err) => {
	console.error(chalk.red(`[${err.config.url}] Error response received`));
	console.error(pe.render(err));
	if (err.response) {
		// The request was made and the server responded with a status code
		// that falls out of the range of 2xx
		console.error(err.response.data);
		console.error(err.response.status);
		console.error(err.response.headers);
	}
	return Promise.reject(err);
};

// export an api_instance with valid spotify token and request interceptor (to refresh token as needed)
module.exports = (() => {
	console.log(chalk.yellow('Setting up NYT api instance...'));
	api_instance.interceptors.request.use(req_interceptor);
	api_instance.interceptors.response.use(res_interceptor, res_err_interceptor);
	console.log(chalk.green('✔ NYT api instance ready'));
	return Promise.resolve(api_instance);
})();