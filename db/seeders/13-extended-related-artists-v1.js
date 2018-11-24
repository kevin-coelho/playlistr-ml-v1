/*jshint esversion: 6, node: true*/
'use strict';

// DEPENDENCIES
const chalk = require('chalk');
const PrettyError = require('pretty-error');
const pe = new PrettyError();
const models = require('../models');
const Promise = require('bluebird');
const Artist = models.Artist;
const RelatedArtist = models.RelatedArtist;

// MODULE DEPS
const { getRelatedArtistConfig } = require('../../get_spotify/util');
const { sleep } = require('../../utils');

module.exports = {
	up: (queryInterface, Sequelize) => {
		return new Promise((resolve, reject) => {
			console.log('Starting...');
			const get_api_instance = require('../../api_manager');
			return get_api_instance.then(api_instance => {
				return Sequelize.query(`SELECT DISTINCT r1."secondaryArtist" FROM related_artist r1 LEFT JOIN related_artist r2 ON r
	                           1."secondaryArtist" = r2."primaryArtist" WHERE r2."primaryArtist" IS NULL;`, { type: Sequelize.QueryTypes.SELECT })
					.then(artist_ids => Promise.map(artist_ids, id => Promise.all([id, sleep(25).then(() => api_instance.request(getRelatedArtistConfig(id)))]), {
						concurrency: 1,
					}))
					.then(results => {
						const artists = results.reduce((a, c) => {
							a.push(...c[1].map(artist => ({
								id: artist.id,
								href: artist.href,
								name: artist.name,
								popularity: artist.popularity,
								type: artist.type,
								uri: artist.uri,
								createdAt: new Date(),
								updatedAt: new Date(),								
							})));
							return a;
						}, []);
						const relatedArtists = results.reduce((a, c) => {
							const primaryArtist = c[0];
							const relatedArtists = c[1];
							a.push(...relatedArtists.map(artist => ({
								primaryArtist,
								secondaryArtist: artist.id,
								createdAt: new Date(),
								updatedAt: new Date(),
							})));
						}, []);
						return Artist.bulkCreate(artists, { ignoreDuplicates: true })
							.then(() => RelatedArtist.bulkCreate(relatedArtists, { ignoreDuplicates: true }))
							.then(() => console.log(`Loaded new artists: [${chalk.green(artists.length)}]. Loaded "related artist" rows: [${chalk.green(relatedArtists.length)}]`))
							.then(() => resolve());
					});
			}).catch(err => reject(err));
		});
	},
	down: (queryInterface, Sequelize) => {
		/*
		  Add reverting commands here.
		  Return a promise to correctly handle asynchronicity.

		  Example:
		  return queryInterface.bulkDelete('Person', null, {});
		*/
		console.log(`${chalk.red('Extended related artists has no unseed.')} To remove, unseed 10-related-artists (remove all related artists).`);
		return Promise.resolve();
	}
};