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
const res_file = './api_results/spotify_playlists.json';
const res_file_additional = './api_results/spotify_playlist_additional.json';
const { getPlaylistConfig, sleep } = require('./util');
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

const additional_playlists = [
	'37i9dQZF1DXarebqD2nAVg', // tender
 	'37i9dQZF1DXaJZdVx8Fwkq', // sad vibe
 	'37i9dQZF1DXb1IUaS6F7Z8', // celtic punk
];

const main = async () => {
	try {
		//const api_instance = await require('./api_manager');
		//const first_results = await loop(api_instance);
		//const second_results = await Promise.map(additional_playlists, (async (id) => (await api_instance.request(getPlaylistConfig(id))).data));
		//fs.writeFileAsync(res_file, JSON.stringify(first_results.concat(second_results)));
		//fs.writeFileAsync(res_file_additional, JSON.stringify(second_results));
	}
	catch (err) {
		console.error(chalk.red(err));
	}
}

if (require.main === module) {
	main();
}