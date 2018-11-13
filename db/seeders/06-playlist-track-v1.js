/*jshint esversion: 6, node: true*/
'use strict';

// DEPENDENCIES
const chalk = require('chalk');
const fs = require('fs');
const PrettyError = require('pretty-error');
const pe = new PrettyError();
const models = require('../models');
const PlaylistTrack = models.PlaylistTrack;

// CONSTANTS
const toy_path = '../get_toy_set/results/toy_data_set_playlists_full.json';
if (!fs.existsSync(toy_path)) throw new Error(`[${toy_path}] Toy set not found`);
const Promise = require('bluebird');
const toy_set = JSON.parse(fs.readFileSync(toy_path));
const tracks_playlist_ids = toy_set.reduce((a, playlist) => {
	a.push(...playlist.tracks.map(playlist_track => playlist_track.track).map(({ id }) => ({ trackId: id, playlistId: playlist.id })));
	return a;
}, []);

module.exports = {
	up: (queryInterface, Sequelize) => {
		const filtered = tracks_playlist_ids.map(track => Object.assign(track, {
			createdAt: new Date(),
			updatedAt: new Date(),			
		}));
		return PlaylistTrack.bulkCreate(filtered, { ignoreDuplicates: true })
			.catch(err => process.exit(console.log(`${chalk.red('Seed failed.')}`, err.parent.detail)))
			.then(console.log(`${chalk.green('Seed Success')} Track playlist associations inserted: ${chalk.green(filtered.length)}`));
	},

	down: (queryInterface, Sequelize) => {
		/*
		  Add reverting commands here.
		  Return a promise to correctly handle asynchronicity.

		  Example:
		  return queryInterface.bulkDelete('Person', null, {});
		*/
		return queryInterface.bulkDelete('playlist_track', null, {});
	}
};