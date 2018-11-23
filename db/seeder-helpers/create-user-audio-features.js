/*jshint esversion: 6, node: true*/
'use strict';

const chalk = require('chalk');
const fs = require('fs');
const user_path = '../get_user_set/results/user_data_set_tracks_audio_features.json';
const user_audio_features = (() => {
	if (fs.existsSync(user_path)) return JSON.parse(fs.readFileSync(user_path));
	console.log(chalk.red('Toy set not found, exiting...'));
	process.exit(1);
})();
const Promise = require('bluebird');
const models = require('../models');
const AudioFeature = models.AudioFeature;

const filtered = Object.keys(user_audio_features).reduce((a, track_id) => {
	a.push(Object.assign(user_audio_features[track_id], { id: track_id, trackId: track_id, createdAt: new Date(), updatedAt: new Date() }));
	return a;
}, [])
	.filter((track, idx, self) => self.findIndex(elem => elem.trackId === track.trackId) === idx);

module.exports = {
	up: (queryInterface, Sequelize) => {
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
		const Op = Sequelize.Op;
		return queryInterface.bulkDelete('AudioFeatures', {
			id: {
				[Op.or]: filtered.map(audio_feature => audio_feature.id),
			},
		}, {}).then(() => console.log(`Removed user set audio feautures. Count: ${chalk.red(filtered.length)}`));
	}
};