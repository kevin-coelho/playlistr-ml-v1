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

module.exports = {
	up: (queryInterface, Sequelize) => {
		const filtered = toy_playlists.map(playlist => {
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
	},

	down: (queryInterface, Sequelize) => {
		/*
		  Add reverting commands here.
		  Return a promise to correctly handle asynchronicity.

		  Example:
		  return queryInterface.bulkDelete('Person', null, {});
		*/
		return queryInterface.bulkDelete('Playlists', null, {});
	}
};