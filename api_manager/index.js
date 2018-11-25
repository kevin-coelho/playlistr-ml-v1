// DEPENDENCIES
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const PrettyError = require('pretty-error');
const pe = new PrettyError();
const chalk = require('chalk');
const assert = require('chai').assert;

// CONSTANTS
const { root_dir, token_dir } = require('./constants');

// ENVIRONMENT
const env_path = `${root_dir}/.env`;
(async () => {
	try { await fs.statAsync(env_path); }
	catch (err) { console.error(chalk.red(`[${env_path}]`), 'Env not found, exiting...'); process.exit(1); }
})();
require('dotenv').config({ path:  env_path });
try {
	assert(process.env.SPOTIFY_CLIENT_ID, 'Error! Required env variable not present: SPOTIFY_CLIENT_ID');
	assert(process.env.SPOTIFY_CLIENT_SECRET, 'Error! Required env variable not present: SPOTIFY_CLIENT_SECRET');
//	assert(process.env.NYTIMES_API_KEY, 'Error! Required env variable not present: NYTIMES_API_KEY');
} catch (err) {
	console.log(pe.render(err));
	process.exit(1);
}

// SETUP TOKEN DIR
(async () => {
	try { await fs.statAsync(token_dir); }
	catch (err) { await fs.mkdirAsync(token_dir); }
})();


module.exports = {
	spotify: () => require('./spotify'),
	nyt: () => require('./nytimes'),
};
