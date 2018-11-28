const chalk = require('chalk');
const fs = require('fs');
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

module.exports = (data_file) => {
	if (!fs.existsSync(data_file)) throw new Error(`[${data_file}] Data file not found.`);
	console.log(`[${chalk.yellow(data_file)}] Starting seed with tracks data file...`);
	const tracks = JSON.parse(fs.readFileSync(data_file));

	const filtered = tracks.reduce((a, playlist) => {
		a.push(...playlist.tracks.map(playlist_track => playlist_track.track).filter(track => track.id));
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

	return {
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
			return queryInterface.bulkDelete('Tracks', {}, {})
				.then(() => console.log('Removed tracks.'));
		}
	};
};