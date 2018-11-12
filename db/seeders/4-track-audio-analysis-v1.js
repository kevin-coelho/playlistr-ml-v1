/*jshint esversion: 6, node: true*/
'use strict';

// DEPENDENCIES
const chalk = require('chalk');
const fs = require('fs');
const { parser } = require('stream-json');
const { streamObject } = require('stream-json/streamers/StreamObject');
const PrettyError = require('pretty-error');
const pe = new PrettyError();

// CONSTANTS
const toy_path = '../get_toy_set/results/toy_data_set_tracks_audio_analysis.json';
if (!fs.existsSync(toy_path)) throw new Error(`[${toy_path}] Toy set not found`);
const Promise = require('bluebird');
const batchSize = 100;

// FUNCTIONS
const pushBatch = async (batch, queryInterface) => {
	const filtered = batch.filter((track, idx, self) => self.findIndex(elem => elem.trackId === track.trackId) === idx);
	try {
		return queryInterface.bulkInsert('AudioAnalyses', filtered, {})
			.then(() => console.log(`${chalk.green('Bulk insert success.')} Tracks inserted: ${filtered.length}`))
			.then(() => Promise.resolve([]));
	} catch (err) {
		console.log(`${chalk.red('Bulk insert failure.')}`);
		console.log(pe.render(err));
		return Promise.resolve([]);
	}
};

module.exports = {
	up: (queryInterface, Sequelize) => {
		return new Promise((resolve, reject) => {
			console.log('Starting...');
			const pipeline = fs.createReadStream(toy_path).pipe(parser({ streamValues: false })).pipe(streamObject());
			let counter = 0;
			let batch = [];
			let queue = [];
			pipeline.on('data', (chunk) => {
				batch.push(Object.assign(Object.keys(chunk.value).reduce((a, key) => {
					a[key] = JSON.stringify(chunk.value[key]);
					return a;
				}, {}), { trackId: chunk.key, createdAt: new Date(), updatedAt: new Date() }));
				++counter;
				if (counter % batchSize == 0) {
					queue.push(pushBatch(batch, queryInterface));
					batch = [];
				}
			});
			pipeline.on('end', () => {
				queue.push(pushBatch(batch, queryInterface));
				Promise.all(queue)
					.then(() => resolve(console.log(`${chalk.green('JSON Stream complete.')} Objects processed: ${chalk.green(counter)}`)));
			});
		});
	},

	down: (queryInterface, Sequelize) => {
		/*
		  Add reverting commands here.
		  Return a promise to correctly handle asynchronicity.

		  Example:
		  return queryInterface.bulkDelete('Person', null, {});
		*/
		return queryInterface.bulkDelete('AudioAnalyses', null, {});
	}
};