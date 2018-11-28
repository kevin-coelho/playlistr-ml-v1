// DEPENDENCIES
const chalk = require('chalk');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

// MAIN FUNCTION
const main = async (playlist_file) => {
	if (!fs.existsSync(playlist_file)) {
		console.error(`[${chalk.red(playlist_file)}] Provided playlist file does not exist.`);
		process.exit(1);
	}
	const toy_set = JSON.parse(await fs.readFileAsync(playlist_file));
	let totals = toy_set.map(playlist => playlist.tracks.length);
	totals.sort((a, b) => (b - a));
	console.log('Tracks by playlist, sorted\n', totals);
	console.log('Track total: ', chalk.green(totals.reduce((a, c) => a + c, 0)));
};

if (require.main === module) {
	main();
}

module.exports = main;