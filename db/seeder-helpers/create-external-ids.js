/*jshint esversion: 6, node: true*/
'use strict';

// DEPENDENCIES
const chalk = require('chalk');
const fs = require('fs');
const PrettyError = require('pretty-error');
const pe = new PrettyError();
const { filterUnique } = require('../../utils');
const models = require('../models');
const Promise = require('bluebird');
const ExternalId = models.ExternalId;
const TrackExternalId = models.TrackExternalId;

module.exports = (data_file) => {
	if (!fs.existsSync(data_file)) throw new Error(`[${data_file}] Data file not found.`);
	console.log(`[${chalk.yellow(data_file)}] Starting seed with external ids data file...`);

	const external_ids_data = JSON.parse(fs.readFileSync(data_file));
	const tracks_external_ids = external_ids_data.reduce((a, playlist) => {
		a.push(...playlist.tracks.map(playlist_track => playlist_track.track).map(({ id, external_ids }) => ({ id, trackId: id, external_ids })));
		return a;
	}, []);

	const externalIds = filterUnique(tracks_external_ids.filter(track => (track.external_ids.isrc)).map(track => ({
		id: track.trackId,
		trackId: track.trackId,
		key: 'isrc',
		value: track.external_ids.isrc,
		createdAt: new Date(),
		updatedAt: new Date(),
	})), 'id');

	const trackExternalIds = externalIds.map(track => ({
		externalId: track.id,
		trackId: track.id,
		createdAt: new Date(),
		updatedAt: new Date(),
	}));

	let externalIdCount = externalIds.length;
	let trackExternalIdCount = trackExternalIds.length;


	return {
		up: (queryInterface, Sequelize) => {
			return Promise.map(externalIds, external_id => ExternalId.bulkCreate([external_id], { ignoreDuplicates: true })
				.catch(err => {
					externalIdCount = externalIdCount - 1;
					console.error(chalk.red(`${err.parent.detail}`));
					return Promise.resolve();
				}), { concurrency: 4 })
				.then(() => Promise.map(trackExternalIds, track_external_id => TrackExternalId.bulkCreate([track_external_id], { ignoreDuplicates: true })
					.catch(err => {
						trackExternalIdCount = trackExternalIdCount - 1;
						console.error(chalk.red(`${err.parent.detail}`));
						return Promise.resolve();						
					})))
				.catch(err => {
					console.error(pe.render(err));
					console.error(`${chalk.red('Seed failed.')}`);
					return Promise.reject(err);
				})
				.then(console.log(`${chalk.green('Seed Success')} External ids seeded: ${chalk.green(externalIdCount)}`))
				.then(console.log(`${chalk.green('Seed Success')} Track external id links seeded: ${chalk.green(trackExternalIdCount)}`));
		},

		down: (queryInterface, Sequelize) => {
			/*
			  Add reverting commands here.
			  Return a promise to correctly handle asynchronicity.

			  Example:
			  return queryInterface.bulkDelete('Person', null, {});
			*/
			return queryInterface.bulkDelete('track_external_id', {}, {})
				.then(() => console.log('Removed track external id links.'))
				.then(() => queryInterface.bulkDelete('ExternalIds', {}, {}))
				.then(() => console.log('Removed external ids.'));
		},
	};
};