const chalk = require('chalk');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const res_file = 'spotify_playlists.json';
const list_file = 'spotify_playlists_names.json';

fs.readFileAsync(res_file)
.then(data => JSON.parse(data))
.then(list => fs.writeFileAsync(list_file, JSON.stringify(list.map((c => {
	return {
		id: c.id,
		name: c.name,
		tracks: c.tracks
	};
})))))
.catch(err => console.error(chalk.red(err)));
