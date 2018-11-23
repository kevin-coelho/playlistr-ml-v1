/*jshint esversion: 6, node: true*/
'use strict';

const chalk = require('chalk');
const fs = require('fs');
const { filterUnique } = require('../../utils');
const user_path = '../get_user_set/results/user_data_set_artists.json';
const user_artists = (() => {
	if (fs.existsSync(user_path)) return JSON.parse(fs.readFileSync(user_path));
	return null;
})();
const Promise = require('bluebird');
const models = require('../models');
const Artist = models.Artist;

// CONSTANTS
const include_keys = [
	'id',
	'href',
	'is_playable',
	'name',
	'popularity',
	'type',
	'uri',
];

const filtered = filterUnique(user_artists, 'id')
	.map(artist => {
		return Object.keys(artist)
			.filter(key => include_keys.includes(key))
			.reduce((filteredObj, key) => {
				filteredObj[key] = artist[key];
				filteredObj['createdAt'] = new Date();
				filteredObj['updatedAt'] = new Date();
				return filteredObj;
			}, {});
	});

module.exports = {
	up: (queryInterface, Sequelize) => {

		return Artist.bulkCreate(filtered, { ignoreDuplicates: true })
			.catch(err => process.exit(console.log(`${chalk.red('Seed failed.')}`, err.parent)))
			.then(console.log(`${chalk.green('Seed Success')} Artists seeded: ${chalk.green(filtered.length)}`));
	},

	down: (queryInterface, Sequelize) => {
		/*
		  Add reverting commands here.
		  Return a promise to correctly handle asynchronicity.

		  Example:
		  return queryInterface.bulkDelete('Person', null, {});
		*/
		const Op = Sequelize.Op;
		return queryInterface.bulkDelete('Artists', {
			id: {
				[Op.or]: filtered.map(artist => artist.id),
			},
		}, {}).then(() => console.log(`Removed user set artists. Count: ${chalk.red(filtered.length)}`));
	}
};