require('dotenv').config();
const axios = require('axios');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const moment = require('moment');
const btoa = require('btoa');
const PrettyError = require('pretty-error');
const pe = new PrettyError();
const chalk = require('chalk');
const qs = require('querystring');

const token_file = 'spotify_token.json';

const api_instance = axios.create({
	baseURL: 'https://api.spotify.com/v1',
	timeout: 1000
});

class PlaylistrSpotifyApi {
	constructor(token = null) {
		
	}
}

api_instance.interceptors.request.use(request => {	
	console.log(chalk.green('Starting Request'), request);
	return request;
});

/*
api_instance.interceptors.response.use(response => {
	console.log(chalk.yellow('Response:'), response);
	return response;
}); */

// get access token
function getToken() {
	if (fs.existsSync(token_file)) {
		return fs.readFileAsync(token_file)
			.then(data => JSON.parse(data))
			.then(token_obj => {
				// token expired, get new one
				if (moment(token_obj.expiration).isBefore(moment())) return tokenRequest();
				else return Promise.resolve(token_obj.access_token);
			});
	} else return tokenRequest();
}

// send request to spotify to get a new access token and write to file
function tokenRequest() {
	return api_instance.request(tokenRequestConfig())
		.then(res => res.data)
		.then(token_obj => {
			token_obj.expiration = moment().add(token_obj.expires_in, 'seconds');
			return fs.writeFileAsync(token_file, JSON.stringify(token_obj))
				.then(() => token_obj.access_token);
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

// curl -X GET "https://api.spotify.com/v1/users/wizzler/playlists" -H "Authorization: Bearer {your access token}"
function playlistRequestConfig(access_token, offset) {
	const auth_header = `Bearer ${access_token}`;
	return {
		url: '/users/kpocket/playlists',
		method: 'get',
		headers: {
			'Authorization': auth_header,
		},
		params: {
			limit: 50,
			offset
		}
	};
}

getToken()
	.then(token => api_instance.request(playlistRequestConfig(token, 0)))
	.then(res => fs.writeFileAsync(res_file, JSON.stringify(res.data)))
	.catch(err => {
		console.error(pe.render(err));
		if (err.response) {
			// The request was made and the server responded with a status code
			// that falls out of the range of 2xx
			console.error(err.response.data);
			console.error(err.response.status);
			console.error(err.response.headers);
		}
	});

// users/kpocket