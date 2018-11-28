// DEPENDENCIES
const chalk = require('chalk');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const PrettyError = require('pretty-error');
const pe = new PrettyError();

// CONSTANTS
const { getArtistConfig, arrayToBatches } = require('./util');
const batchSizeLimit = 50;

// MAIN FUNCTION
const main = async (playlists_json_file, outfile, err_file) => {
	const api_instance = await require('../api_manager').spotify();
	const artist_ids = JSON.parse(await fs.readFileAsync(playlists_json_file)).reduce((artist_ids, current_playlist) => {
		// playlist -> playlist_track objects -> track object -> artist objects -> artist object -> id
		artist_ids.push(...current_playlist.tracks.reduce((ids, playlist_track) => {
			ids.push(...playlist_track.track.artists.map(artist => artist.id));
			return ids;
		}, []));
		return artist_ids;
	}, []).filter((elem, idx, arr) => idx === arr.findIndex(e => e === elem)).filter(elem => elem);
	console.log(`Unique artist ids found: ${chalk.yellow(artist_ids.length)}`);
	const batched_ids = arrayToBatches(artist_ids, batchSizeLimit);
	return Promise.map(batched_ids, id_array => Promise.all([id_array, api_instance.request(getArtistConfig(id_array))])
		.catch(() => Promise.resolve([id_array, false])), { concurrency: 4 })
		.then(results => results.reduce((result_obj, batch_result) => {
			if (!result_obj.failed_batches) result_obj.failed_batches = [];
			if (!result_obj.success_ids) result_obj.success_ids = [];
			if (!batch_result[1]) {
				// error occurred on this batch, push to error object
				result_obj.failed_batches.push(batch_result[0]);
			} else {
				//console.log(batch_result[1]);
				batch_result[0].forEach((id, idx) => {
					result_obj.success_ids.push(Object.assign(batch_result[1].artists[idx], { id }));
				});
			}
			return result_obj;
		}, {}))
		.then(result_obj => {
			return Promise.all([
				fs.writeFileAsync(outfile, JSON.stringify(result_obj.success_ids))
					.then(() => console.log(`[${chalk.green(outfile)}] Wrote artists to file for tracks: ${chalk.green(Object.keys(result_obj.success_ids).length)}`)),
				Promise.resolve(result_obj.failed_batches).then(failed_batches => {
					if (failed_batches.length > 0) {
						return fs.writeFileAsync(err_file, JSON.stringify(failed_batches))
							.then(() => console.log(`[${chalk.red(err_file)}] Failed batches written to err file: ${chalk.red(failed_batches.length)}`));
					}
					return Promise.resolve();
				}),
			]);
		})
		.catch(err => console.error(pe.render(err)));
};

if (require.main === module) {
	main();
}

module.exports = main;