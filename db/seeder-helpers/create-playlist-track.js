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

	const playlist_tracks = tracks_playlist_ids.map(track => Object.assign(track, {
		createdAt: new Date(),
		updatedAt: new Date(),
	}));

	let count = playlist_tracks.length;

	return {
		up: (queryInterface, Sequelize) => {
			return Promise.map(playlist_tracks, playlist_track => PlaylistTrack.bulkCreate([playlist_track], { ignoreDuplicates: true })
				.catch(err => {
					count = count - 1;
					console.error(chalk.red(`${err.parent.detail}`));
					return Promise.resolve();
				}), { concurrency: 4 })
				.catch(err => {
					console.error(pe.render(err));
					console.error(`${chalk.red('Seed failed.')}`);
					return Promise.reject(err);
				})
				.then(console.log(`${chalk.green('Seed Success')} Playlist track associations inserted: ${chalk.green(count)}`));
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