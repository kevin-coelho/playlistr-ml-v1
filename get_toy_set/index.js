// DEPENDENCIES
const chalk = require('chalk');
const PrettyError = require('pretty-error');
const pe = new PrettyError();
const path = require('path');
const Promise = require('bluebird');

// CONSTANTS
const { results_dir } = require('./constants');

// SCRIPTS TO RUN
const scripts = [
	require('./get_toy_set'),
	require('./get_artists_by_track'),
	require('./get_related_artists'),
	require('./get_audio_analysis'),
	require('./get_audio_features'),
];

// run in order
const main = async () => {
	let err_flag = false;
	console.log('Fetching entire toy set. This may take some time...');
	try {
		await Promise.each(scripts, script => script());
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
