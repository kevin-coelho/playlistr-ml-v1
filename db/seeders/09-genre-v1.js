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
const models = require('../models');
const Genre = models.Genre;
const ArtistGenre = models.ArtistGenre;

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

module.exports = {
	up: (queryInterface, Sequelize) => {
		return Genre.bulkCreate(genres, { ignoreDuplicates: true })
			.catch(err => console.error(err.parent.error))
			.then(console.log(`${chalk.green('Seed Success')} Genres seeded: ${chalk.green(genres.length)}`))
			.then(() => ArtistGenre.bulkCreate(artist_genres, { ignoreDuplicates: true }))
			.catch(err => console.error(err.parent.error))
			.then(console.log(`${chalk.green('Seed Success')} artist_genre associations seeded: ${chalk.green(artist_genres.length)}`));
	},
	down: (queryInterface, Sequelize) => {
		/*
		  Add reverting commands here.
		  Return a promise to correctly handle asynchronicity.

		  Example:
		  return queryInterface.bulkDelete('Person', null, {});
		*/
		const Op = Sequelize.Op;
		return queryInterface.bulkDelete('artist_genre', {
			[Op.or]: artist_genres.map(artist_genre => ({
				genre: artist_genre.genre,
				artistId: artist_genre.artistId,
			})),
		}, {})
			.then(() => console.log(`Removed toy set artist genre linkings. Count: ${chalk.red(artist_genres.length)}`))
			.then(() => queryInterface.bulkDelete('Genres', {
				name: {
					[Op.or]: genres.map(genre => genre.name),
				},
			}, {}))
			.then(() => console.log(`Removed toy set artist track linkings. Count: ${chalk.red(genres.length)}`));
	}
};