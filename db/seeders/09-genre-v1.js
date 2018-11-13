/*jshint esversion: 6, node: true*/
'use strict';

const chalk = require('chalk');
const fs = require('fs');
const toy_path = '../get_toy_set/results/toy_data_set_artists.json';
const toy_artists = (() => {
	if (fs.existsSync(toy_path)) return JSON.parse(fs.readFileSync(toy_path));
	return null;
})();
const Promise = require('bluebird');

module.exports = {
	up: (queryInterface, Sequelize) => {
		const genres = toy_artists.reduce((a, artist) => {
			a.push(...artist.genres);
			return a;
		}, [])
			.filter((genre, idx, arr) => idx === arr.findIndex(elem => elem === genre))
			.map(genre => ({ name: genre, createdAt: new Date(), updatedAt: new Date() }));
		const artist_genres = toy_artists.reduce((a, artist) => {
			a.push(...artist.genres.reduce((a, genre) => {
				a.push({
					artistId: artist.id,
					genre,
					createdAt: new Date(),
					updatedAt: new Date(),
				});
				return a;
			}, []));
			return a;
		}, []);
		return queryInterface.bulkInsert('Genres', genres, {})
			.catch(err => process.exit(console.error(err.parent.detail)))
			.then(console.log(`${chalk.green('Seed Success')} Genres seeded: ${chalk.green(genres.length)}`))
			.then(() => queryInterface.bulkInsert('artist_genre', artist_genres, {}))
			.catch(err => process.exit(console.error(err.parent.detail)))
			.then(console.log(`${chalk.green('Seed Success')} artist_genre associations seeded: ${chalk.green(artist_genres.length)}`));
	},

	down: (queryInterface, Sequelize) => {
		/*
		  Add reverting commands here.
		  Return a promise to correctly handle asynchronicity.

		  Example:
		  return queryInterface.bulkDelete('Person', null, {});
		*/
		return queryInterface.bulkDelete('artist_genre', null, {})
			.then(() => queryInterface.bulkDelete('Genres', null, {}));
	}
};