/*jshint esversion: 6, node: true*/
'use strict';

const chalk = require('chalk');
const fs = require('fs');
const Promise = require('bluebird');
const models = require('../models');
const Genre = models.Genre;
const ArtistGenre = models.ArtistGenre;

module.exports = (data_file) => {
	if (!fs.existsSync(data_file)) throw new Error(`[${data_file}] Data file not found.`);
	console.log(`[${chalk.yellow(data_file)}] Starting seed with artists data file...`);
	const artists_data = JSON.parse(fs.readFileSync(data_file));

	const genres = artists_data.reduce((a, artist) => {
		a.push(...artist.genres);
		return a;
	}, [])
		.filter((genre, idx, arr) => idx === arr.findIndex(elem => elem === genre))
		.map(genre => ({ name: genre, createdAt: new Date(), updatedAt: new Date() }));
	const artist_genres = artists_data.reduce((a, artist) => {
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

	return {
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
			return queryInterface.bulkDelete('artist_genre', {})
				.then(() => console.log('Removed artist genres.'));
		},
	};
};