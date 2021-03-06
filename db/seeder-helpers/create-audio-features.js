/*jshint esversion: 6, node: true*/
'use strict';

const chalk = require('chalk');
const fs = require('fs');
const Promise = require('bluebird');
const models = require('../models');
const AudioFeature = models.AudioFeature;

module.exports = (data_file) => {
	if (!fs.existsSync(data_file)) throw new Error(`[${data_file}] Data file not found.`);
	console.log(`[${chalk.yellow(data_file)}] Starting seed with audio features data file...`);
	const audio_features_data = JSON.parse(fs.readFileSync(data_file));

	const filtered = Object.keys(audio_features_data).reduce((a, track_id) => {
		if (track_id in audio_features_data && audio_features_data[track_id]) {
			a.push(Object.assign(audio_features_data[track_id], { id: track_id, trackId: track_id, createdAt: new Date(), updatedAt: new Date() }));
		}
		return a;
	}, [])
		.filter((track, idx, self) => self.findIndex(elem => elem.trackId === track.trackId) === idx);

	let count = filtered.length;

	return {
		up: (queryInterface, Sequelize) => {
			return Promise.map(filtered, audioFeature => AudioFeature.bulkCreate([audioFeature], { ignoreDuplicates: true })
				.catch(err => {
					count = count - 1;
					console.error(chalk.red(`${err.parent.detail}`));
					return Promise.resolve();
				}), { concurrency: 4 })
				.then(console.log(`${chalk.green('Seed Success')} Audio Features seeded: ${chalk.green(count)}`))
				.catch(err => {
					console.log(`${chalk.red('Seed failed.')}`, err.parent.detail);
					return Promise.reject(err);
				});
		},
		down: (queryInterface, Sequelize) => {
			/*
			  Add reverting commands here.
			  Return a promise to correctly handle asynchronicity.

			  Example:
			  return queryInterface.bulkDelete('Person', null, {});
			*/
			return queryInterface.bulkDelete('AudioFeatures', {}, {})
				.then(() => console.log('Removed audio feautures.'));
		},
	};
};