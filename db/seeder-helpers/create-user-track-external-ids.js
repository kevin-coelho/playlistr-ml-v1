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
const user_path = '../get_user_set/results/user_data_set_playlists_full.json';
if (!fs.existsSync(user_path)) throw new Error(`[${user_path}] Toy set not found`);
const Promise = require('bluebird');
const user_set = JSON.parse(fs.readFileSync(user_path));
const tracks_external_ids = user_set.reduce((a, playlist) => {
	a.push(...playlist.tracks.map(playlist_track => playlist_track.track).map(({ id, external_ids }) => ({ id, trackId: id, external_ids })));
	return a;
}, []);

const filtered = filterUnique(tracks_external_ids.filter(track => (track.external_ids.isrc)).map(track => ({
	id: track.trackId,
	trackId: track.trackId,
	key: 'isrc',
	value: track.external_ids.isrc,
	createdAt: new Date(),
	updatedAt: new Date(),
})), 'id');

module.exports = {
	up: (queryInterface, Sequelize) => {
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
		const Op = Sequelize.Op;
		return queryInterface.bulkDelete('track_external_id', {
			[Op.or]: filtered.map(track => ({
				externalId: track.id,
				trackId: track.id
			}))
		}, {})
			.then(() => console.log(`Removed user set track external id links. Count: ${chalk.red(filtered.length)}`))
			.then(() => queryInterface.bulkDelete('ExternalIds', {
				id: {
					[Op.or]: filtered.map(track => track.id),
				},
			}, {}))
			.then(() => console.log(`Removed user set external ids. Count: ${chalk.red(filtered.length)}`));
	}
};