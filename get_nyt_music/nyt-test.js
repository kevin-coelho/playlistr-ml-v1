// DEPENDENCIES
const chalk = require('chalk');
const PrettyError = require('pretty-error');
const pe = new PrettyError();
const path = require('path');
const Promise = require('bluebird');
const fs = require('fs');
const axios = require('axios');

// CONSTANTS
const { results_dir } = require('./constants');

// SCRIPTS TO RUN
/*
const scripts = [
	require('./get_toy_set'),
	require('./get_artists_by_track'),
	require('./get_related_artists'),
	require('./get_audio_analysis'),
	require('./get_audio_features'),
];*/

// run in order
const main = async () => {	
	let err_flag = false;
	if (!fs.existsSync(path.resolve(results_dir))) {
		fs.mkdirSync(path.resolve(results_dir));
	}
	console.log('Fetching NYT music articles. This may take some time...');
	const nyt_api = await require('../api_manager').nyt();
	console.log(nyt_api);
	try {
		const result = await nyt_api.request({
			method: 'get',
			params: {
				q: 'music',
				begin_date: '19550101',
			},
		});
		fs.writeFileSync(path.join(results_dir, 'test-result.json'), JSON.stringify(result));
		const result_2 = await axios.get('https://www.nytimes.com/2018/07/24/arts/music/review-marlboro-festival-mitsuko-uchida.html');
		fs.writeFileSync(path.join(results_dir, 'test-result-2.html'), result_2.data);
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
