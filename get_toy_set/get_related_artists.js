// DEPENDENCIES
const chalk = require('chalk');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const PrettyError = require('pretty-error');
const pe = new PrettyError();

// CONSTANTS
const { toy_playlists_artists, toy_playlists_related_artists } = require('./constants');
const { getRelatedArtistConfig } = require('./util');
const { sleep } = require('../utils');

// MAIN FUNCTION
const main = async () => {
	try {
		const toy_set = JSON.parse(await fs.readFileAsync(toy_playlists_artists));
		const api_instance = await require('../api_manager');
		const artist_ids = toy_set.map(artist => artist.id);
		Promise.map(artist_ids, id => Promise.all([id, sleep(25).then(() => api_instance.request(getRelatedArtistConfig(id)))]), {
			concurrency: 1,
		})
			.then(results => results.reduce((result_obj, result) => {
				result_obj[result[0]] = result[1].artists;
				return result_obj;
			}, {}))
			.then(results => {
				return fs.writeFileAsync(toy_playlists_related_artists, JSON.stringify(results))
					.then(() => console.log(`[${chalk.green(toy_playlists_related_artists)}] Wrote related artists to file for artists: ${chalk.green(Object.keys(results).length)}`));
			})
			.catch(err => console.error(pe.render(err)));
	} catch (err) {
		console.error(pe.render(err));
	}
};
main();