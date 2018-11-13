/*jshint esversion: 6, node: true*/
'use strict';

// DEPENDENCIES
const chalk = require('chalk');
const fs = require('fs');
const Chain = require('stream-chain');
const { parser } = require('stream-json');
const { streamObject } = require('stream-json/streamers/StreamObject');
const PrettyError = require('pretty-error');
const pe = new PrettyError();
const models = require('../models');
const AudioAnalysis = models.AudioAnalysis;

// CONSTANTS
const toy_path = '../get_toy_set/results/toy_data_set_tracks_audio_analysis.json';
if (!fs.existsSync(toy_path)) throw new Error(`[${toy_path}] Toy set not found`);
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

module.exports = {
	up: (queryInterface, Sequelize) => {
		return new Promise((resolve, reject) => {
			console.log('Starting...');
			let count = 0;
			const pipeline = new Chain([
				fs.createReadStream(toy_path),
				parser({ streamValues: false }),
				streamObject(),
				chunk => {
					return AudioAnalysis.upsert(Object.assign(Object.keys(chunk.value).reduce((a, key) => {
						if (include_keys.includes(key)) a[key] = chunk.value[key];
						return a;
					}, {}), { trackId: chunk.key, createdAt: new Date(), updatedAt: new Date() }))
						.then(() => {
							count = count + 1;
							console.log(`Loaded analysis: ${chunk.key}`);
						});
				},
			]);
			pipeline.on('error', err => console.log(pe.render(err)));
			pipeline.on('finish', () => resolve(console.log(`${chalk.green('JSON Stream complete.')} Loaded analysis for tracks: ${chalk.green(count)}`)));
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