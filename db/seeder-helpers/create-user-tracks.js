/*jshint esversion: 6, node: true*/
'use strict';

const chalk = require('chalk');
const fs = require('fs');
const user_path = '../get_user_set/results/user_data_set_playlists_full.json';
const user_playlists = (() => {
	if (fs.existsSync(user_path)) return JSON.parse(fs.readFileSync(user_path));
	return null;
})();
const Promise = require('bluebird');
const models = require('../models');
const Track = models.Track;

// CONSTANTS
const include_keys = [
	'id',
	'href',
	'is_playable',
	'disc_number',
	'name',
	'duration_ms',
	'explicit',
	'popularity',
	'preview_url',
	'track_number',
	'type',
	'uri',
	'is_local',
];

const filtered = user_playlists.reduce((a, playlist) => {
	a.push(...playlist.tracks.map(playlist_track => playlist_track.track));
	return a;
}, [])
	.map(track => {
		return Object.keys(track)
			.filter(key => include_keys.includes(key))
			.reduce((filteredObj, key) => {
				filteredObj[key] = track[key];
				filteredObj['createdAt'] = new Date();
				filteredObj['updatedAt'] = new Date();
				return filteredObj;
			}, {});
	})
	.filter((track, idx, self) => self.findIndex(elem => elem.id === track.id) === idx);

module.exports = {
	up: (queryInterface, Sequelize) => {
		return Track.bulkCreate(filtered, { ignoreDuplicates: true })
			.catch(err => process.exit(console.log(`${chalk.red('Seed failed.')}`, err.parent)))
			.then(console.log(`${chalk.green('Seed Success')} Tracks seeded: ${chalk.green(filtered.length)}`));
	},

	down: (queryInterface, Sequelize) => {
		/*
		  Add reverting commands here.
		  Return a promise to correctly handle asynchronicity.

		  Example:
		  return queryInterface.bulkDelete('Person', null, {});
		*/
		const Op = Sequelize.Op;
		return queryInterface.bulkDelete('Tracks', {
			id: {
				[Op.or]: filtered.map(track => track.id),
			},
		}, {}).then(() => console.log(`Removed user tracks. Count: ${chalk.red(user_playlists.length)}`));
	}
};