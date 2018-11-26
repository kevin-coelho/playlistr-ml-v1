/*jshint esversion: 6, node: true*/
'use strict';

// DEPENDENCIES
const chalk = require('chalk');
const fs = require('fs');
const PrettyError = require('pretty-error');
const pe = new PrettyError();
const Promise = require('bluebird');
const models = require('../models');
const PlaylistTrack = models.PlaylistTrack;

module.exports = (data_file) => {
	if (!fs.existsSync(data_file)) throw new Error(`[${data_file}] Data file not found.`);
	console.log(`[${chalk.yellow(data_file)}] Starting seed with playlist data file...`);
	const tracks_data = JSON.parse(fs.readFileSync(data_file));

	const tracks_playlist_ids = tracks_data.reduce((a, playlist) => {
		a.push(...playlist.tracks.map(playlist_track => playlist_track.track).map(({ id }) => ({ trackId: id, playlistId: playlist.id })));
		return a;
	}, []).filter(obj => obj.trackId);

	const filtered = tracks_playlist_ids.map(track => Object.assign(track, {
		createdAt: new Date(),
		updatedAt: new Date(),
	}));

	return {
		up: (queryInterface, Sequelize) => {
			return PlaylistTrack.bulkCreate(filtered, { ignoreDuplicates: true })
				.catch(err => {
					console.log(`${chalk.red('Seed failed.')}`, err.parent.detail);
					return Promise.reject(err);
				})
				.then(console.log(`${chalk.green('Seed Success')} Track playlist associations inserted: ${chalk.green(filtered.length)}`));
		},

		down: (queryInterface, Sequelize) => {
			/*
			  Add reverting commands here.
			  Return a promise to correctly handle asynchronicity.

			  Example:
			  return queryInterface.bulkDelete('Person', null, {});
			*/
			return queryInterface.bulkDelete('playlist_track', {}, {})
				.then(() => console.log('Removed toy set playlist track linkings.'));
		}
	};
};