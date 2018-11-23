// DEPENDENCIES
const chalk = require('chalk');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const PrettyError = require('pretty-error');
const pe = new PrettyError();

// CONSTANTS
const { getTrackAudioAnalysisConfig } = require('./util');

// MAIN FUNCTION
const main = async (playlists_json_file, outfile) => {
	const toy_set = JSON.parse(await fs.readFileAsync(playlists_json_file));
	const api_instance = await require('../api_manager').spotify();
	const track_ids = toy_set.reduce((track_arr, current_playlist) => {
		track_arr.push(...current_playlist.tracks.map(playlist_track => playlist_track.track.id));
		return track_arr;
	}, []);
	return Promise.map(track_ids, id => Promise.all([id, api_instance.request(getTrackAudioAnalysisConfig(id))]), {
		concurrency: 3,
	})
		.then(results => results.reduce((result_obj, result) => {
			delete result[1].track.codestring;
			delete result[1].track.echoprintstring;
			delete result[1].track.synchstring;
			delete result[1].track.rhythmstring;
			result_obj[result[0]] = { track: result[1].track };
			return result_obj;
		}, {}))
		.then(results => {
			return fs.writeFileAsync(outfile, JSON.stringify(results))
				.then(() => console.log(`[${chalk.green(outfile)}] Wrote audio analysis to file for tracks: ${chalk.green(Object.keys(results).length)}`));
		})
		.catch(err => console.error(pe.render(err)));

};

if (require.main === module) {
	main();
}

module.exports = main;