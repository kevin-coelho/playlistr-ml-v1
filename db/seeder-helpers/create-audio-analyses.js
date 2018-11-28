/*jshint esversion: 6, node: true*/
'use strict';

// DEPENDENCIES
const chalk = require('chalk');
const fs = require('fs');
const JSONStream = require('JSONStream');
const es = require('event-stream');
const PrettyError = require('pretty-error');
const pe = new PrettyError();
const models = require('../models');
const AudioAnalysis = models.AudioAnalysis;

// CONSTANTS
const Promise = require('bluebird');
const include_keys = [
	'duration',
	'loudness',
	'tempo',
	'tempo_confidence',
	'time_signature',
	'time_signature_confidence',
	'key',
	'key_confidence',
	'mode',
	'mode_confidence',
];

module.exports = (data_file) => {

	if (!fs.existsSync(data_file)) throw new Error(`[${data_file}] Data file not found.`);
	console.log(`[${chalk.yellow(data_file)}] Starting seed with audio analysis data file...`);

	return {
		up: (queryInterface, Sequelize) => {
			return new Promise((resolve, reject) => {
				let count = 0;
				const chain = fs.createReadStream(data_file)
					.pipe(JSONStream.parse([{ emitKey: true }]))
					.pipe(es.through(async function write({ key: trackId, value: { track: full_analysis }}) {
						if (!this.paused) this.pause();
						const analysis = Object.assign(Object.keys(full_analysis).reduce((a, key) => {
							if (include_keys.includes(key)) {
								a[key] = full_analysis[key];
								return a;
							}
							return a;
						}, {}), {
							trackId,
							createdAt: new Date(),
							updatedAt: new Date(),
						});
						this.pause();
						await AudioAnalysis.bulkCreate([analysis], { ignoreDuplicates: true})
							.catch(err => {
								console.error(chalk.red(err.parent.detail));
								return Promise.resolve();
							})
							.then(() => {
								count = count + 1;
								console.log(`Loaded analysis: ${trackId}`);
							});
						if (this.paused) this.resume();
					}, function end() { this.emit('end'); }));
				chain.on('error', (err) => console.error(pe.render(err)));
				chain.on('end', () => {
					console.log(`${chalk.green('JSON Stream complete.')} Loaded analysis for tracks: ${chalk.green(count)}`);
					resolve();
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
			return queryInterface.bulkDelete('AudioAnalyses', null, {})
				.then(() => console.log('Removed audio analyses.'));
		}
	};
};