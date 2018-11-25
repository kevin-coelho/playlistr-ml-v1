// DEPENDENCIES
const chalk = require('chalk');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const PrettyError = require('pretty-error');
const pe = new PrettyError();

// CONSTANTS
const { user_playlists_full } = require('./constants');

// MAIN FUNCTION
const main = async () => {
	const user_set = JSON.parse(await fs.readFileAsync(user_playlists_full));
	let totals = user_set.map(playlist => playlist.tracks.length);
	totals.sort((a, b) => (b - a));
	console.log(totals);
	console.log('Grand total: ', totals.reduce((a, c) => a + c, 0));
};

if (require.main === module) {
	main();
}

module.exports = main;