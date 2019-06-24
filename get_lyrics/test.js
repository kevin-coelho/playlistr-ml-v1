// DEPENDENCIES
const chalk = require('chalk');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const PrettyError = require('pretty-error');
const pe = new PrettyError();
const axios = require('axios');
const path = require('path');

// SETUP RESULTS DIR
const RESULTS_DIR = path.resolve(__dirname, 'results');
try { fs.mkdirSync(RESULTS_DIR); }
catch (err) { console.error(pe.render(err)); }

// MAIN FUNCTION
const main = async () => {
	try {
		const url = 'https://genius.com/Ariana-grande-7-rings-lyrics';
		const test = (await axios.get(url)).data;
		fs.writeFileSync(path.join(RESULTS_DIR, 'test'), test);
	} catch (err) {
		console.error(pe.render(err));
	}
};

if (require.main === module) {
	main();
}

module.exports = main;
