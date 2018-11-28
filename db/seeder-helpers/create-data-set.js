/*jshint esversion: 6, node: true*/
'use strict';

// DEPENDENCIES
const chalk = require('chalk');
const fs = require('fs');
const Promise = require('bluebird');
const PrettyError = require('pretty-error');
const pe = new PrettyError();
const models = require('../models');
const DataSet = models.DataSet;
const DataSetPlaylist = models.DataSetPlaylist;

module.exports = (data_file, dataset_name) => {
	if (!fs.existsSync(data_file)) throw new Error(`[${data_file}] Data file not found.`);
	console.log(`[${chalk.yellow(data_file)}] Starting seed with playlists data file...`);
	const playlist_ids = JSON.parse(fs.readFileSync(data_file));
	let count = playlist_ids.length;

	return {
		up: (queryInterface, Sequelize) => {
			console.log('Starting...');
			return DataSet.bulkCreate([{
				name: dataset_name,
				createdAt: new Date(),
				updatedAt: new Date(),
			}], { ignoreDuplicates: true })
				.then(() => Promise.map(playlist_ids.map(elem => ({
					datasetName: dataset_name,
					playlistId: elem.id,
					createdAt: new Date(),
					updatedAt: new Date(),
				})), playlist => DataSetPlaylist.bulkCreate([playlist], { ignoreDuplicates: true })
					.catch(err => {
						count = count - 1;
						console.error(chalk.red(err.parent.detail));
						return Promise.resolve();
					}), { concurrency: 4 }))
				.catch(err => {
					console.error(pe.render(err));
					return Promise.reject(err);
				})
				.then(() => console.log(`dataset_playlist associations failed: ${chalk.red(playlist_ids.length - count)}`))
				.then(() => console.log(`${chalk.green('Seed Success')} dataset_playlist associations seeded: ${chalk.green(count)}`));
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
				.then(() => queryInterface.bulkDelete('DataSets', {
					name: dataset_name,
				}), {});
		}
	};
};