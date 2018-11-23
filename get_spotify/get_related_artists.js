// DEPENDENCIES
const chalk = require('chalk');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const PrettyError = require('pretty-error');
const pe = new PrettyError();

// CONSTANTS
const { getRelatedArtistConfig } = require('./util');
const { sleep } = require('../utils');

// MAIN FUNCTION
const main = async (artists_json_file, outfile) => {
	const toy_set = JSON.parse(await fs.readFileAsync(artists_json_file));
	const api_instance = await require('../api_manager').spotify();
	const artist_ids = toy_set.map(artist => artist.id);
	return Promise.map(artist_ids, id => Promise.all([id, sleep(25).then(() => api_instance.request(getRelatedArtistConfig(id)))]), {
		concurrency: 1,
	})
		.then(results => results.reduce((result_obj, result) => {
			result_obj[result[0]] = result[1].artists;
			return result_obj;
		}, {}))
		.then(results => {
			return fs.writeFileAsync(outfile, JSON.stringify(results))
				.then(() => console.log(`[${chalk.green(outfile)}] Wrote related artists to file for artists: ${chalk.green(Object.keys(results).length)}`));
		})
		.catch(err => console.error(pe.render(err)));
};

if (require.main === module) {
	main();
}

module.exports = main;