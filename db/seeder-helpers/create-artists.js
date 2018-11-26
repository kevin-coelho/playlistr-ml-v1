/*jshint esversion: 6, node: true*/
'use strict';

const chalk = require('chalk');
const fs = require('fs');
const { filterUnique } = require('../../utils');
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

module.exports = (data_file) => {
	if (!fs.existsSync(data_file)) throw new Error(`[${data_file}] Data file not found.`);
	console.log(`[${chalk.yellow(data_file)}] Starting seed with artists data file...`);
	const artists_data = JSON.parse(fs.readFileSync(data_file));

	const filtered = filterUnique(artists_data, 'id')
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

	return {
		up: (queryInterface, Sequelize) => {

			return Artist.bulkCreate(filtered, { ignoreDuplicates: true })
				.catch(err => {
					console.log(`${chalk.red('Seed failed.')}`, err.parent);
					return Promise.reject(err);
				})
				.then(console.log(`${chalk.green('Seed Success')} Artists seeded: ${chalk.green(filtered.length)}`));
		},

		down: (queryInterface, Sequelize) => {
			/*
			  Add reverting commands here.
			  Return a promise to correctly handle asynchronicity.

			  Example:
			  return queryInterface.bulkDelete('Person', null, {});
			*/
			return queryInterface.bulkDelete('Artists', null)
				.then(() => console.log('Removed artists.'));
		}
	};
};