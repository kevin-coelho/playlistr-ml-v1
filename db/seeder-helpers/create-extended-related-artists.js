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
const Genre = models.Genre;
const ArtistGenre = models.ArtistGenre;
const get_api_instance = require('../../api_manager').spotify;
const { getArtistConfig } = require('../../get_spotify/util');

module.exports = (data_file) => {
	if (!fs.existsSync(data_file)) throw new Error(`[${data_file}] Data file not found.`);
	console.log(`[${chalk.yellow(data_file)}] Starting seed with related artists data file...`);

	return {
		up: (queryInterface, Sequelize) => {
			return new Promise((resolve, reject) => {
				get_api_instance().then(api_instance => {
					const pipeline = fs.createReadStream(data_file)
						.pipe(JSONStream.parse('*'))
						.pipe(es.through(async function write([primary, related]) {
							if(!this.paused) this.pause();
							const artist = {
								id: related.id,
								href: related.href,
								name: related.name,
								popularity: related.popularity,
								type: related.type,
								uri: related.uri,
								createdAt: new Date(),
								updatedAt: new Date(),
							};
							const relatedArtist = {
								primaryArtist: primary,
								secondaryArtist: related.id,
								createdAt: new Date(),
								updatedAt: new Date(),
							};
							console.log(artist);
							console.log(relatedArtist);
							const genres = related.genres.map(genre => Object.assign(genre, {
								createdAt: new Date(),
								updatedAt: new Date(),
							}));
							const artist_genres = genres.map(genre => ({
								artistId: related.id,
								genre,
								createdAt: new Date(),
								updatedAt: new Date(),
							}));
							await Artist.findByPk(primary)
								.then(result => {
									console.log('got reuslt...');
									console.log(result ? result : '');
									process.exit(0);
								});
/*
							Artist.bulkCreate([artist], { ignoreDuplicates: true })
								.catch(err => {
									console.error(err);
									console.error(chalk.red(err.parent.detail));
									process.exit(1);
								});*/
							/*
							await Artist.findById(primary)
								.then(result => result ? Promise.resolve() : api_instance.request(getArtistConfig([primary]))
									.then(res => {
										console.log(res);
										return Promise.resolve(res);
									})
									.then(({ artists }) => Artist.bulkCreate(artists.map(artist => ({
										id: artist.id,
										href: artist.href,
										name: artist.name,
										popularity: artist.popularity,
										type: artist.type,
										uri: artist.uri,
										createdAt: new Date(),
										updatedAt: new Date(),
									})), { ignoreDuplicates: true })))
								.then(() => Artist.bulkCreate([artist], { ignoreDuplicates: true }))
								.then(() => console.log(`Created artist ${artist.id}`))
								.catch(err => {
									console.error(err);
									process.exit(1);
								})
								.then(() => RelatedArtist.bulkCreate([relatedArtist], { ignoreDuplicates: true }))
								.then(() => Genre.bulkCreate(genres, { ignoreDuplicates: true }))
								.then(() => ArtistGenre.bulkCreate(artist_genres, { ignoreDuplicates: true }))
								.then(() => console.log(`Loaded chunk: ${primary}`))
								.catch((err) => {
									console.error(err);
									console.error(chalk.red(err.parent.detail));
									process.exit(1);
	//								return Promise.resolve();
								});*/
							this.emit('data', true);
							if(this.paused) this.resume();
						}, function end() { this.emit('end'); }));
					pipeline.on('error', err => console.error(pe.render(err)));
					pipeline.on('end', () => {
						console.log(`${chalk.green('JSON Stream complete.')}`);
						resolve();
					});
				});
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
