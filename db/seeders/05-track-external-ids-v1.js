/*jshint esversion: 6, node: true*/
'use strict';

// DEPENDENCIES
const chalk = require('chalk');
const fs = require('fs');
const PrettyError = require('pretty-error');
const pe = new PrettyError();
const { filterUnique } = require('../../utils');
const models = require('../models');
const ExternalId = models.ExternalId;
const TrackExternalId = models.TrackExternalId;

// CONSTANTS
const toy_path = '../get_toy_set/results/toy_data_set_playlists_full.json';
if (!fs.existsSync(toy_path)) throw new Error(`[${toy_path}] Toy set not found`);
const Promise = require('bluebird');
const toy_set = JSON.parse(fs.readFileSync(toy_path));
const tracks_external_ids = toy_set.reduce((a, playlist) => {
	a.push(...playlist.tracks.map(playlist_track => playlist_track.track).map(({ id, external_ids }) => ({ id, trackId: id, external_ids })));
	return a;
}, []);

module.exports = {
	up: (queryInterface, Sequelize) => {
		const filtered = filterUnique(tracks_external_ids.filter(track => (track.external_ids.isrc)).map(track => ({
			id: track.trackId,
			trackId: track.trackId,
			key: 'isrc',
			value: track.external_ids.isrc,
			createdAt: new Date(),
			updatedAt: new Date(),
		})), 'id');
		return ExternalId.bulkCreate(filtered, { ignoreDuplicates: true })
			.then(() => TrackExternalId.bulkCreate(filtered.map(track => ({
				externalId: track.id,
				trackId: track.id,
				createdAt: new Date(),
				updatedAt: new Date(),
			})), { ignoreDuplicates: true }))
			.catch(err => process.exit(console.log(`${chalk.red('Seed failed.')}`, err.parent.detail)))
			.then(console.log(`${chalk.green('Seed Success')} Track External Ids seeded: ${chalk.green(filtered.length)}`));
	},

	down: (queryInterface, Sequelize) => {
		/*
		  Add reverting commands here.
		  Return a promise to correctly handle asynchronicity.

		  Example:
		  return queryInterface.bulkDelete('Person', null, {});
		*/
		return queryInterface.bulkDelete('track_external_id', null, {})
			.then(() => queryInterface.bulkDelete('ExternalIds', null, {}));
	}
};