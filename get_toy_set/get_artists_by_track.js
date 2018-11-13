// DEPENDENCIES
const chalk = require('chalk');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const PrettyError = require('pretty-error');
const pe = new PrettyError();
const { filterUnique } = require('../utils');

// CONSTANTS
const { toy_playlists_full, toy_playlists_artists, artists_errors } = require('./constants');
const { getArtistConfig, arrayToBatches } = require('./util');
const batchSizeLimit = 50;

// MAIN FUNCTION
const main = async () => {
	try {
		const api_instance = await require('../api_manager');
		const artist_ids = JSON.parse(await fs.readFileAsync(toy_playlists_full)).reduce((artist_ids, current_playlist) => {
			// playlist -> playlist_track objects -> track object -> artist objects -> artist object -> id
			artist_ids.push(...current_playlist.tracks.reduce((ids, playlist_track) => {
				ids.push(...playlist_track.track.artists.map(artist => artist.id));
				return ids;
			}, []));
			return artist_ids;
		}, []).filter((elem, idx, arr) => idx === arr.findIndex(e => e === elem));
		console.log(`Unique artist ids found: ${chalk.yellow(artist_ids.length)}`);
		const batched_ids = arrayToBatches(artist_ids, batchSizeLimit);
		Promise.map(batched_ids, id_array => Promise.all([ id_array, api_instance.request(getArtistConfig(id_array))])
			.catch(() => Promise.resolve([ id_array, false ])), { concurrency: 4 })
			.then(results => results.reduce((result_obj, batch_result) => {
				if (!result_obj.failed_batches) result_obj.failed_batches = [];
				if (!result_obj.success_ids) result_obj.success_ids = [];
				if (!batch_result[1]) {
				// error occurred on this batch, push to error object
					result_obj.failed_batches.push(batch_result[0]);
				}
				else {
				//console.log(batch_result[1]);
					batch_result[0].forEach((id, idx) => {
						result_obj.success_ids.push(Object.assign(batch_result[1].artists[idx], { id }));
					});
				}
				return result_obj;
			}, {}))
			.then(result_obj => {
				return Promise.all([
					fs.writeFileAsync(toy_playlists_artists, JSON.stringify(result_obj.success_ids))
						.then(() => console.log(`[${chalk.green(toy_playlists_artists)}] Wrote artists to file for tracks: ${chalk.green(Object.keys(result_obj.success_ids).length)}`)),
					fs.writeFileAsync(artists_errors, JSON.stringify(result_obj.failed_batches))
						.then(() => result_obj.failed_batches ? console.log(`[${chalk.red(artists_errors)}] Failed batches written to err file: ${chalk.red(result_obj.failed_batches.length)}`) : null),
				]);
			})
			.catch(err => console.error(pe.render(err)));
	} catch (err) {
		console.error(pe.render(err));
	}
};

main();
// curl -X GET "https://api.spotify.com/v1/audio-features/?ids=4JpKVNYnVcJ8tuMKjAj50A,2NRANZE9UCmPAS5XVbXL40,24JygzOLM0EmRQeGtFcIcG" -H "Authorization: Bearer {your access token}"
