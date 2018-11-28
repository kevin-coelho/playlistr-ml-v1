/*jshint esversion: 6, node: true*/
'use strict';

// DEPENDENCIES
const chalk = require('chalk');
const Promise = require('bluebird');
const PrettyError = require('pretty-error');
const pe = new PrettyError();
const models = require('../models');
const {
	DataSetSplit,
	sequelize,
	Sequelize,
} = models;

module.exports = (split_ratio, dataset_name) => {	
	return {
		up: async () => {
			console.log('Starting...');
			const tracks = await sequelize.query(`SELECT tr."trackId" from dataset_playlist ds INNER JOIN "Playlists" pl on ds."playlistId" = pl."id" INNER JOIN playlist_track tr ON tr."playlistId" = pl."id" WHERE ds."datasetName" = '${dataset_name}';`,
				{ type: Sequelize.QueryTypes.SELECT }).map(({ trackId }) => trackId);
			const maxSplit = await sequelize.query('SELECT max("splitId") from "DataSetSplits";', 
				{ type: Sequelize.QueryTypes.SELECT });			
			const splitId = maxSplit.length > 0 ? maxSplit[0].max + 1 : 0;
			console.log('Creating split with id: ', chalk.yellow(splitId));
			const splits = tracks.map(trackId => ({
				trackId,
				splitId,
				dataSet: dataset_name,
				label: (Math.random() * 100 > split_ratio ? 'test': 'train'),
				createdAt: new Date(),
				updatedAt: new Date(),
			}));
			let test_count = 0;
			let train_count = 0;
			return Promise.map(splits, split => DataSetSplit.bulkCreate([split], { ignoreDuplicates: true })
				.catch(err => {
					console.error(chalk.red(err));
					return Promise.resolve();
				})
				.then(() => {
					test_count = test_count + (split.label == 'test' ? 1 : 0);
					train_count = train_count + (split.label == 'train' ? 1 : 0);
				}), { concurrency: 4 })
				.then(() => console.log(`Loaded data splits. Train total: ${chalk.green(train_count)}. Test Total: ${chalk.green(test_count)}. Total: ${chalk.green(train_count + test_count)}`))
				.catch(err => {
					console.error(pe.render(err));
					return Promise.reject(err);
				});
		},
		down: (queryInterface, Sequelize) => {
			/*
			  Add reverting commands here.
			  Return a promise to correctly handle asynchronicity.

			  Example:
			  return queryInterface.bulkDelete('Person', null, {});
			*/
			return queryInterface.bulkDelete('DataSetSplit', {}, {})
				.then(() => console.log('Removed dataset splits.'));
		}
	};
};