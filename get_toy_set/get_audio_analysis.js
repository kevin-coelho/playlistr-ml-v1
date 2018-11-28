// DEPENDENCIES
const chalk = require('chalk');
const PrettyError = require('pretty-error');
const pe = new PrettyError();
const path = require('path');
const Promise = require('bluebird');
const fs = require('fs');

// MODULE DEPENDENCIES
const {
	get_audio_analysis_by_playlist_stream,
} = require('../get_spotify');

// CONSTANTS
const {
	toy_playlists_full,
	toy_playlists_audio_analysis,
	audio_analysis_errors,
	results_dir,
} = require('./constants');

// SCRIPTS TO RUN
const scripts = [
	[get_audio_analysis_by_playlist_stream, [toy_playlists_full, toy_playlists_audio_analysis, audio_analysis_errors]],
];

// run in order
const main = async () => {
	let err_flag = false;
	if (!fs.existsSync(path.resolve(results_dir))) {
		fs.mkdirSync(path.resolve(results_dir));
	}
	console.log('Fetching entire toy set. This may take some time...');
	try {
		await Promise.each(scripts, ([script, args]) => script(...args));
	} catch (err) {
		console.error(pe.render(err));
		err_flag = true;
	}
	console.log(err_flag ? chalk.red('Completed with errors.') : `[${chalk.green(path.resolve(results_dir))}] Toy set JSON fetch complete.`);
};

if (require.main === module) {
	main();
}

module.exports = main;
