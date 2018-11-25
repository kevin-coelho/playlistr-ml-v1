// DEPENDENCIES
const chalk = require('chalk');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const PrettyError = require('pretty-error');
const pe = new PrettyError();
const Chain = require('stream-chain');
const { parser } = require('stream-json');
const { streamObject } = require('stream-json/streamers/StreamObject');
const { streamArray } = require('stream-json/streamers/StreamArray');

// MODULE DEPS
const { now } = require('../utils');

// CONSTANTS
const { getTrackAudioAnalysisConfig } = require('./util');

// MAIN FUNCTION
const main = async (playlists_json_file, outfile, errfile) => {
	const api_instance = await require('../api_manager').spotify();

	return new Promise((resolve, reject) => {
		const failed_results = [];
		const startTime = now('milli');
		let count = 0;
		let sep = '';
		const out = fs.createWriteStream(outfile);
		out.write('{');

		const pipeline = new Chain([
			fs.createReadStream(playlists_json_file),
			parser({ streamValues: false }),
			streamArray(),
			({ value: playlist }) => Promise.map(playlist.tracks.map(playlist_track => playlist_track.track.id).filter(id => id),
				id => Promise.all([id, api_instance.request(getTrackAudioAnalysisConfig(id))]).catch(err => Promise.resolve([id, false])), { concurrency: 3, })
				.then(results => results.reduce((result_obj, result) => {
					if (result[1]) {
						delete result[1].track.codestring;
						delete result[1].track.echoprintstring;
						delete result[1].track.synchstring;
						delete result[1].track.rhythmstring;
						result_obj[result[0]] = { track: result[1].track };
						return result_obj;
					} else {
						failed_results.push(result[0]);
					}
				}, {})),
			obj => {
				let result = '';
				Object.keys(obj).forEach(trackId => {
					result = result + `${sep}"${trackId}": ${JSON.stringify(obj[trackId])}`;
					if (!sep) sep = ',';
					count = count + 1;
					console.log(`Wrote analysis: ${chalk.yellow(trackId)}`);
					console.log(`Completed ${count}. Avg process time: ${((now('milli') - startTime) / count).toFixed(2)} ms`);
				});
				return result;
			}
		]).pipe(out);
		pipeline.on('error', err => console.log(pe.render(err)));
		pipeline.on('finish', () => {
			// append final } for valid json
			fs.appendFileSync(outfile, '}');
			// write errors
			if (failed_results.length > 0) {
				fs.writeFileSync(JSON.stringify(failed_results));
				console.log(`[${chalk.red(errfile)}] Wrote failed requests for tracks: ${chalk.red(failed_results.length)}`);
			}
			fs.writeFileSync(JSON.stringify(failed_results));
			console.log(`[${chalk.green(outfile)}] Wrote audio analysis to file for tracks: ${chalk.green(count)}`);
			return resolve();
		});
	});
};

if (require.main === module) {
	main();
}

module.exports = main;