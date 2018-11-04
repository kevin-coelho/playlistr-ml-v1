// DEPENDENCIES
const chalk = require('chalk');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const PrettyError = require('pretty-error');
const pe = new PrettyError();

// CONSTANTS
const { toy_id_file, toy_playlists_full } = require('./constants');
const { getPlaylistConfig, pagingLoop, getTrackAudioAnalysisConfig } = require('./util');
const { sleep } = require('../utils');

// MAIN FUNCTION
const main = async () => {
	try {
		const toy_set = JSON.parse(await fs.readFileAsync(toy_id_file));
		const api_instance = await require('../api_manager');
		Promise.map(toy_set, playlist => {
			console.log(`Processing playlist: "${playlist.name}"`);
			console.log(playlist);
			return sleep(10).then(() => api_instance.request(getPlaylistConfig(playlist.id)));
		}, {
			concurrency: 1,
		})
		.then(results => results.map(elem => elem.data))
		// fill out tracks we didn't catch in the first request
		.then(results => Promise.map(results, result => Promise.all([Promise.resolve(result), pagingLoop(api_instance, result.tracks)])))
		.then(results => results.map(([result, all_tracks]) => Object.assign(result, { tracks: all_tracks })))
		.then(results => 
			fs.writeFileAsync(toy_playlists_full, JSON.stringify(results))
			.then(() => console.log(`[${chalk.green(toy_playlists_full)}] Wrote toy playlists to file: ${chalk.green(results.length)}`))
		)
		.catch(err => console.error(pe.render(err)));
	} catch (err) {
		console.error(pe.render(err));
	}
}

main();