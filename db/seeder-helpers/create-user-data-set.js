/*jshint esversion: 6, node: true*/
'use strict';

// DEPENDENCIES
const chalk = require('chalk');
const fs = require('fs');
const PrettyError = require('pretty-error');
const pe = new PrettyError();
const models = require('../models');
const DataSet = models.DataSet;
const DataSetPlaylist = models.DataSetPlaylist;

// CONSTANTS
const user_path = '../get_user_set/user_data_set_playlist_ids.json';
if (!fs.existsSync(user_path)) throw new Error(`[${user_path}] Toy set not found`);
const user_set = JSON.parse(fs.readFileSync(user_path));
const Promise = require('bluebird');
const dataset_name = 'spotify_user_data_set';

module.exports = {
	up: (queryInterface, Sequelize) => {
		console.log('Starting...');
		return DataSet.bulkCreate([{
			name: dataset_name,
			createdAt: new Date(),
			updatedAt: new Date(),
		}], { ignoreDuplicates: true })
			.then(() => DataSetPlaylist.bulkCreate(user_set.map(elem => ({
				datasetName: dataset_name,
				playlistId: elem.id,
				createdAt: new Date(),
				updatedAt: new Date(),
			})), { ignoreDuplicates: true }))
			.catch(err => console.error(pe.render(err)))
			.then(console.log(`${chalk.green('Seed Success')} dataset_playlist associations seeded: ${chalk.green(user_set.length)}`));
	},
	down: (queryInterface, Sequelize) => {
		/*
		  Add reverting commands here.
		  Return a promise to correctly handle asynchronicity.

		  Example:
		  return queryInterface.bulkDelete('Person', null, {});
		*/
		return queryInterface.bulkDelete('dataset_playlist', {
			datasetName: dataset_name
		}, {})
			.then(() => queryInterface.bulkDelete('DataSet', {
				name: dataset_name,
			}), {});
	}
};