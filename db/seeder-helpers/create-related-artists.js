/*jshint esversion: 6, node: true*/
'use strict';

// DEPENDENCIES
const chalk = require('chalk');
const fs = require('fs');
const Promise = require('bluebird');
const Chain = require('stream-chain');
const { parser } = require('stream-json');
const { streamObject } = require('stream-json/streamers/StreamObject');
const PrettyError = require('pretty-error');
const pe = new PrettyError();
const models = require('../models');
const Artist = models.Artist;
const RelatedArtist = models.RelatedArtist;

module.exports = (data_file) => {
	if (!fs.existsSync(data_file)) throw new Error(`[${data_file}] Data file not found.`);
	console.log(`[${chalk.yellow(data_file)}] Starting seed with related artists data file...`);

	return {
		up: (queryInterface, Sequelize) => {
			return new Promise((resolve, reject) => {
				console.log('Starting...');
				const pipeline = new Chain([
					fs.createReadStream(data_file),
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
						const Op = Sequelize.Op;
						return Artist.bulkCreate(artists, { ignoreDuplicates: true })
							.then(() => Artist.findAll({
								where: {
									id: {
										[Op.or]: relatedArtists.map(artist => artist.primaryArtist),
									},
								},
								raw: true
							}))
							.then((artists) => relatedArtists.filter(artist => artists.includes(artist)))
							.then((related) => RelatedArtist.bulkCreate(related, { ignoreDuplicates: true }))
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
			return queryInterface.bulkDelete('related_artist', {})
				.then(() => console.log('Removed related artists.'));
		},
	};
};