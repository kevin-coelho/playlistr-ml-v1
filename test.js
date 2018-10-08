const chalk = require('chalk');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const res_file = 'spotify_playlists.json';
function playlistRequestConfig(offset) {
	return {
		url: '/users/spotify/playlists',
		method: 'get',
		params: {
			limit: 50,
			offset
		}
	};
}
require('./api_manager')
.then(api_instance => api_instance.request(playlistRequestConfig(0)))
.then(res => fs.writeFileAsync(res_file, JSON.stringify(res.data)))
.catch(err => chalk.red(console.error(err)));