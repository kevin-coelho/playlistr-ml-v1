// DEPENDENCIES
const chalk = require('chalk');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const PrettyError = require('pretty-error');
const pe = new PrettyError();

// CONSTANTS
const { getPlaylistConfig, pagingLoop } = require('./util');
const { sleep } = require('../utils');

// MAIN FUNCTION
const main = async (id_file, outfile) => {
	const toy_set = JSON.parse(await fs.readFileAsync(id_file));
	const api_instance = await require('../api_manager').spotify();
	return Promise.map(toy_set, playlist => {
		console.log(`Processing playlist: "${playlist.name}"`);
		return sleep(10).then(() => api_instance.request(getPlaylistConfig(playlist.id)));
	}, { concurrency: 1 })
		// fill out tracks we didn't catch in the first request
		.then(results => Promise.map(results, result => Promise.all([Promise.resolve(result), pagingLoop(api_instance, result.tracks)])))
		.then(results => results.map(([result, all_tracks]) => Object.assign(result, { tracks: all_tracks })))
		.then(results =>
			fs.writeFileAsync(outfile, JSON.stringify(results))
				.then(() => console.log(`[${chalk.green(outfile)}] Wrote playlists to file: ${chalk.green(results.length)}`))
		)
		.catch(err => console.error(pe.render(err)));
};

if (require.main === module) {
	main();
}

module.exports = main;