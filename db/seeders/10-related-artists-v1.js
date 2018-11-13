/*jshint esversion: 6, node: true*/
'use strict';

// DEPENDENCIES
const chalk = require('chalk');
const fs = require('fs');
const Chain = require('stream-chain');
const { parser } = require('stream-json');
const { streamObject } = require('stream-json/streamers/StreamObject');
const PrettyError = require('pretty-error');
const pe = new PrettyError();
const models = require('../models');
const Artist = models.Artist;
const RelatedArtist = models.RelatedArtist;

// CONSTANTS
const toy_path = '../get_toy_set/results/toy_data_set_related_artists.json';
if (!fs.existsSync(toy_path)) throw new Error(`[${toy_path}] Toy set not found`);
const Promise = require('bluebird');

module.exports = {
	up: (queryInterface, Sequelize) => {
		return new Promise((resolve, reject) => {
			console.log('Starting...');
			const pipeline = new Chain([
				fs.createReadStream(toy_path),
				parser({ streamValues: false }),
				streamObject(),
				chunk => {
					const artists = chunk.value.map(artist => ({
						id: artist.id,
						href: artist.href,
						name: artist.name,
						popularity: artist.popularity,
						type: artist.type,
						uri: artist.uri,
						createdAt: new Date(),
						updatedAt: new Date(),
					}));
					const relatedArtists = chunk.value.map(artist => ({
						primaryArtist: chunk.key,
						secondaryArtist: artist.id,
						createdAt: new Date(),
						updatedAt: new Date(),
					}));
					return Artist.bulkCreate(artists, { ignoreDuplicates: true })
						.then(() => RelatedArtist.bulkCreate(relatedArtists, { ignoreDuplicates: true }))
						.then(() => console.log(`Loaded chunk: ${chunk.key}`));
				},
			]);
			pipeline.on('error', err => console.log(pe.render(err)));
			pipeline.on('finish', () => resolve(console.log(`${chalk.green('JSON Stream complete.')}`)));
		});
	},
	down: (queryInterface, Sequelize) => {
		/*
		  Add reverting commands here.
		  Return a promise to correctly handle asynchronicity.

		  Example:
		  return queryInterface.bulkDelete('Person', null, {});
		*/
		return queryInterface.bulkDelete('related_artist', null, {});
	}
};