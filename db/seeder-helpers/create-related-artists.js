/*jshint esversion: 6, node: true*/
'use strict';

// DEPENDENCIES
const chalk = require('chalk');
const fs = require('fs');
const Promise = require('bluebird');
const Chain = require('stream-chain');
const { parser } = require('stream-json');
const { streamObject } = require('stream-json/streamers/StreamObject');
const JSONStream = require('JSONStream');
const es = require('event-stream');
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
				const pipeline = fs.createReadStream(data_file)
					.pipe(JSONStream.parse([{ emitKey: true }]))
					.pipe(es.through(async function write({ key: primary, value: related }) {
						this.pause();
						const artists = related.map(artist => ({
							id: artist.id,
							href: artist.href,
							name: artist.name,
							popularity: artist.popularity,
							type: artist.type,
							uri: artist.uri,
							createdAt: new Date(),
							updatedAt: new Date(),
						}));
						const relatedArtists = related.map(artist => ({
							primaryArtist: primary,
							secondaryArtist: artist.id,
							createdAt: new Date(),
							updatedAt: new Date(),
						}));
						await Artist.bulkCreate(artists, { ignoreDuplicates: true })
							.then(() => Promise.map(relatedArtists, related_artist => RelatedArtist.bulkCreate([related_artist], { ignoreDuplicates: true })
								.catch(err => {
									console.error(chalk.red(err.parent.detail));
									return Promise.resolve();
								}), { concurrency: 1 }))
							.then(() => {
								console.log(`Loaded chunk: ${primary}`);
							})
							.catch(err => {
								this.emit('error', err);				
							});
						this.emit('data', true);
						this.resume();
					}, function end() { this.emit('end'); }));
				pipeline.on('error', err => console.error(pe.render(err)));
				pipeline.on('end', () => {
					console.log(`${chalk.green('JSON Stream complete.')}`);
					resolve();
				});
			});

			/*
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
						return Artist.bulkCreate(artists, { ignoreDuplicates: true })
							.then(() => Promise.map(relatedArtists, related_artist => RelatedArtist.bulkCreate([related_artist], { ignoreDuplicates: true })
								.catch(err => {
									console.error(chalk.red(err.parent.detail));
									return Promise.resolve();
								}), { concurrency: 4 }))
							.then(() => console.log(`Loaded chunk: ${chunk.key}`));
					},
				]);
				pipeline.on('error', err => console.log(pe.render(err)));
				pipeline.on('finish', () => resolve(console.log(`${chalk.green('JSON Stream complete.')}`)));
			});*/
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