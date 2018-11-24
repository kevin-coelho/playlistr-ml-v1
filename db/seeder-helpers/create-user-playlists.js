const chalk = require('chalk');
const fs = require('fs');
const user_path = '../get_user_set/results/user_data_set_playlists_full.json';
const user_playlists = (() => {
	if (fs.existsSync(user_path)) return JSON.parse(fs.readFileSync(user_path));
	return null;
})();
const Promise = require('bluebird');
const models = require('../models');
const Playlist = models.Playlist;

// CONSTANTS
const include_keys = [
	'id',
	'name',
	'collaborative',
	'description',
	'href',
	'name',
	'primary_color',
	'public',
	'snapshot_id',
	'type',
	'uri',
	'createdAt',
	'updatedAt',
];

const up = (queryInterface, Sequelize) => {
	const filtered = user_playlists.map(playlist => {
		return Object.keys(playlist)
			.filter(key => include_keys.includes(key))
			.reduce((filteredObj, key) => {
				filteredObj[key] = playlist[key];
				filteredObj.createdAt = new Date();
				filteredObj.updatedAt = new Date();
				return filteredObj;
			}, {});
	});
	return Playlist.bulkCreate(filtered, { ignoreDuplicates: true, fields: include_keys })
		.catch(err => process.exit(console.log(`${chalk.red('Seed failed.')}`, err.parent)))
		.then(console.log(`${chalk.green('Seed success')} Playlists seeded: ${chalk.green(filtered.length)}`));
};

const down = (queryInterface, Sequelize) => {
	const Op = Sequelize.Op;
	return queryInterface.bulkDelete('Playlists', {
		id: {
			[Op.or]: user_playlists.map(playlist => playlist.id),
		},
	}, {}).then(() => console.log(`Removed user playlists. Count: ${chalk.red(user_playlists.length)}`));
};

console.log('Create user playlist loaded.');

module.exports = { up, down };