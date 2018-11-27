const chalk = require('chalk');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const JSONStream = require('JSONStream');
const es = require('event-stream');
const backwards = require('fs-backwards-stream');

const analysis_file = './results/user_data_set_tracks_audio_analysis.json';

const main = async () => {
	return new Promise((resolve, reject) => {
		let count = 0;
//		const pipeline = fs.createReadStream(analysis_file)
		const pipeline = backwards(analysis_file)
			.pipe(JSONStream.parse([{ emitKey: true }]))
			.pipe(es.mapSync(chunk => {
				count = count + 1;
			}));
		pipeline.on('end', () => {
			console.log('Count: ', count);
			resolve();
		});		
	});
};

main();