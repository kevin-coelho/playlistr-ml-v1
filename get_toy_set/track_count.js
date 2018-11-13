// DEPENDENCIES
const chalk = require('chalk');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const PrettyError = require('pretty-error');
const pe = new PrettyError();

// CONSTANTS
const { toy_playlists_full } = require('./constants');

// MAIN FUNCTION
const main = async () => {
	const toy_set = JSON.parse(await fs.readFileAsync(toy_playlists_full));
	let totals = toy_set.map(playlist => playlist.tracks.length);
	totals.sort((a, b) => (b - a));
	console.log(totals);
};

if (require.main === module) {
	main();
}

module.exports = main;