// DEPENDENCIES
const chalk = require('chalk');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const PrettyError = require('pretty-error');
const pe = new PrettyError();

// CONSTANTS
const { toy_playlists_full, toy_playlists_audio_features, audio_features_errors } = require('./constants');
const { getTrackAudioFeaturesConfig } = require('./util');
const batchSizeLimit = 100;

// MAIN FUNCTION
const main = async () => {
	try {
		const toy_set = JSON.parse(await fs.readFileAsync(toy_playlists_full));
		const api_instance = await require('../api_manager');
		const track_ids = toy_set.reduce((track_arr, current_playlist) => {
			track_arr.push(...current_playlist.tracks.map(playlist_track => playlist_track.track.id));
			return track_arr;
		}, []).reduce((grouped_arrays, track_id, idx) => {
			const outer_index = Math.floor(idx / batchSizeLimit);
			if (typeof grouped_arrays[outer_index] === 'undefined') {
				grouped_arrays[outer_index] = [];
			} else {
				grouped_arrays[outer_index].push(track_id);
			}
			return grouped_arrays;
		}, []);
		return Promise.map(track_ids, id_array => Promise.all([id_array, api_instance.request(getTrackAudioFeaturesConfig(id_array))]).catch(err => {
			console.error(chalk.red(`Error occurred, request ${err.config.url}`));
			return Promise.resolve([ id_array, false ]);
		}), { concurrency: 4 })
			.then(results => results.reduce((result_obj, batch_result) => {
				if (!result_obj.failed_batches) result_obj.failed_batches = [];
				if (!result_obj.success_ids) result_obj.success_ids = {};
				if (!batch_result[1]) {
				// error occurred on this batch, push to error object
					result_obj.failed_batches.push(batch_result[0]);
				}
				else {
				//console.log(batch_result[1]);
					batch_result[0].forEach((id, idx) => {
						result_obj.success_ids[id] = batch_result[1].audio_features[idx];
					});
				}
				return result_obj;
			}, {}))
			.then(result_obj => {
				return Promise.all([
					fs.writeFileAsync(toy_playlists_audio_features, JSON.stringify(result_obj.success_ids))
						.then(() => console.log(`[${chalk.green(toy_playlists_audio_features)}] Wrote audio features to file for tracks: ${chalk.green(Object.keys(result_obj.success_ids).length)}`)),
					fs.writeFileAsync(audio_features_errors, JSON.stringify(result_obj.failed_batches))
						.then(() => result_obj.failed_batches ? console.log(`[${chalk.red(audio_features_errors)}] Failed batches written to err file: ${chalk.red(result_obj.failed_batches.length)}`) : null),
				]);
			})
			.catch(err => console.error(pe.render(err)));
	} catch (err) {
		console.error(pe.render(err));
	}
};

if (require.main === module) {
	main();
}

module.exports = main;
