/*jshint esversion: 6, node: true*/
'use strict';

const fs = require('fs');
const toy_path = '../get_toy_set/results/toy_data_set_playlist_ids.json';
const toy_playlists = ((fs) => {
	if (fs.existsSync(toy_path)) return JSON.parse(fs.readFileSync(toy_path));
	return null;
})(fs);
const Promise = require('bluebird');

module.exports = {
	up: (queryInterface, Sequelize) => {
		const filtered = toy_playlists.map(playlist => {
			return Object.keys(playlist)
			.filter(key => ['id', 'name'].includes(key))
			.reduce((filteredObj, key) => {
				filteredObj[key] = playlist[key];
				filteredObj['createdAt'] = new Date();
				filteredObj['updatedAt'] = new Date();
				return filteredObj;
			}, {})
		});
		return queryInterface.bulkInsert('Playlists', filtered, {
			fields: ['id', 'name'],
		});
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