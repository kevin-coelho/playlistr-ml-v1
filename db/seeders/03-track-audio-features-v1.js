/*jshint esversion: 6, node: true*/
'use strict';

const chalk = require('chalk');
const fs = require('fs');
const toy_path = '../get_toy_set/results/toy_data_set_tracks_audio_features.json';
const toy_audio_features = (() => {
	if (fs.existsSync(toy_path)) return JSON.parse(fs.readFileSync(toy_path));
	console.log(chalk.red('Toy set not found, exiting...'));
	process.exit(1);
})();
const Promise = require('bluebird');
const models = require('../models');
const AudioFeature = models.AudioFeature;

module.exports = {
	up: (queryInterface, Sequelize) => {
		const filtered = Object.keys(toy_audio_features).reduce((a, track_id) => {
			a.push(Object.assign(toy_audio_features[track_id], { id: track_id, trackId: track_id, createdAt: new Date(), updatedAt: new Date() }));
			return a;
		}, [])
			.filter((track, idx, self) => self.findIndex(elem => elem.trackId === track.trackId) === idx);
		return AudioFeature.bulkCreate(filtered, { ignoreDuplicates: true })
			.catch(err => process.exit(console.log(`${chalk.red('Seed failed.')}`, err.parent.detail)))
			.then(console.log(`${chalk.green('Seed Success')} Audio Features seeded: ${chalk.green(filtered.length)}`));
	},

	down: (queryInterface, Sequelize) => {
		/*
		  Add reverting commands here.
		  Return a promise to correctly handle asynchronicity.

		  Example:
		  return queryInterface.bulkDelete('Person', null, {});
		*/
		return queryInterface.bulkDelete('AudioFeatures', null, {});
	}
};