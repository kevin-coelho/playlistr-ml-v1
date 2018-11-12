/*jshint esversion: 6, node: true*/
'use strict';

const chalk = require('chalk');
const fs = require('fs');
const toy_path = '../get_toy_set/results/toy_data_set_playlists_full.json';
const toy_playlists = (() => {
	if (fs.existsSync(toy_path)) return JSON.parse(fs.readFileSync(toy_path));
	return null;
})();
const Promise = require('bluebird');

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

const associated_obj_keys = [
	'external_urls',
	'album',
	'artists',
	'available_markets',
	'tracks',
	'external_ids',
];

module.exports = {
	up: (queryInterface, Sequelize) => {
		const filtered = toy_playlists.reduce((a, playlist) => {
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
		return queryInterface.bulkInsert('Tracks', filtered, {
			fields: include_keys,
		}).then(console.log(`${chalk.green('Seed Success')} Tracks seeded: ${chalk.green(filtered.length)}`));
	},

	down: (queryInterface, Sequelize) => {
		/*
		  Add reverting commands here.
		  Return a promise to correctly handle asynchronicity.

		  Example:
		  return queryInterface.bulkDelete('Person', null, {});
		*/
		return queryInterface.bulkDelete('Tracks', null, {});
	}
};