// DEPENDENCIES
const chalk = require('chalk');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const PrettyError = require('pretty-error');
const pe = new PrettyError();

// CONSTANTS
const { getTrackAudioAnalysisConfig } = require('./util');

async function setupOutfile(outfile) {
	let stats;
	let start;
	try {
		stats = await fs.statAsync(outfile);
		start = stats.size - 1;
	} catch (err) {
		console.error(`[${chalk.red(outfile)}] Audio analysis file does not exist.`);
		throw err;
	}
	const out = fs.createWriteStream(outfile, {
		start,
		flags: 'r+',
	});
	out.write(',');
	return Promise.resolve(out);
}

// MAIN FUNCTION
const main = async (audio_analysis_errfile, outfile, errfile) => {
	let sep = '';
	const out = await setupOutfile(outfile);
	const api_instance = await require('../api_manager').spotify();
	const failed_results = [];

	const err_track_ids = JSON.parse(await fs.readFileAsync(audio_analysis_errfile));
	return Promise.map(err_track_ids, id => Promise.all([id, api_instance.request(getTrackAudioAnalysisConfig(id))
		.catch(err => {
			failed_results.push(id);
			console.error(`[${chalk.red(id)}] Request failed...`);
			console.error(pe.render(err));
			return Promise.resolve([id, false]);
		})]), { concurrency: 3 })
		.then(results => results.reduce((result_obj, result) => {
			if (result[1]) {
				delete result[1].track.codestring;
				delete result[1].track.echoprintstring;
				delete result[1].track.synchstring;
				delete result[1].track.rhythmstring;
				result_obj[result[0]] = { track: result[1].track };
				return result_obj;
			} else {
				return result_obj;
			}
		}, {}))
		.then(results => Promise.map(Object.keys(results), key => {
			const analysis = results[key];
			const write_res = out.write(`${sep}\n${JSON.stringify(key)}: ${JSON.stringify(analysis)}`);
			if (!sep) sep = ',';
			if (!write_res) {
				return new Promise((resolve, reject) => {
					out.once('drain', () => resolve(Object.keys(results)));
				});
			}
			return Promise.resolve(Object.keys(results));
		}))
		.then(written_keys => {
			const write_res = out.write('}');
			if (!write_res) {
				return new Promise((resolve, reject) => {
					out.once('drain', () => resolve(written_keys));
				});
			}
			return Promise.resolve(written_keys);
		})
		.then(keys => console.log(`[${chalk.green(outfile)}] Wrote audio analysis to file for tracks: ${chalk.green(keys.length)}`))
		.then(() => out.end())
		.then(() => {
			if (failed_results.length > 0) {
				return fs.writeFileAsync(errfile, JSON.stringify(failed_results))
					.then(() => console.log(`[${chalk.red(errfile)}] Wrote failed requests for tracks: ${chalk.red(failed_results.length)}`));
			} else {
				return fs.unlinkAsync(audio_analysis_errfile)
					.then(() => console.log(`[${chalk.green(audio_analysis_errfile)}] Removed error file.`));
			}
		});
};

if (require.main === module) {
	main();
}

module.exports = main;
