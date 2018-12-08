// DEPENDENCIES
const chalk = require('chalk');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const PrettyError = require('pretty-error');
const pe = new PrettyError();

// CONSTANTS
const { getTrackByIsrcConfig } = require('./util');
const api_instance = require('../api_manager').musicbrainz;

// MAIN FUNCTION
const main = async () => {
	try {
		const result = await api_instance.request(getTrackByIsrcConfig('GBEWA1803100'));
		console.log(result);
	} catch (err) {
		console.error(pe.render(err));
	}
};

if (require.main === module) {
	main();
}

module.exports = main;