/**
 * Get a list of all spotify playlists 
 * Fields we care about:
 * 		- id
 * 		- name
 * 		- tracks
 */
const chalk = require('chalk');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const res_file = 'spotify_playlists.json';
const limit = 50;
function playlistRequestConfig(offset) {
	return {
		url: '/users/spotify/playlists',
		method: 'get',
		params: {
			limit,
			offset
		}
	};
}
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
const loop = async (api_instance) => {
	let result = [];
	let offset = 0;	
	while (true) {
		config = playlistRequestConfig(offset);
		console.log('Sending request..', chalk.green(config.url));
		current_results = (await api_instance.request(config)).data;
		result.push(...current_results.items);
		console.log('Next: ', chalk.yellow(current_results.next));
		offset = offset + limit;
		await sleep(10);
		if (current_results.next == null) break;
	}
	return result;
}
require('./api_manager')
.then(api_instance => loop(api_instance))
.then(result => fs.writeFileAsync(res_file, JSON.stringify(result)))
.catch(err => chalk.red(console.error(err)));