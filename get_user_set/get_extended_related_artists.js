/*jshint esversion: 6, node: true*/
'use strict';

// DEPENDENCIES
const chalk = require('chalk');
const PrettyError = require('pretty-error');
const pe = new PrettyError();
const Promise = require('bluebird');
const models = require('../db/models');
const Artist = models.Artist;
const RelatedArtist = models.RelatedArtist;
const sequelize = models.sequelize;
const Sequelize = models.Sequelize;

// MODULE DEPS
const { getRelatedArtistConfig } = require('../get_spotify/util');
const { sleep, now } = require('../utils');

const main = async () => {
	return new Promise((resolve, reject) => {
		console.log('Starting...');
		const get_api_instance = require('../api_manager').spotify;
		const failed_results = [];
		let artistCount = 0;
		let relatedCount = 0;
		let iter_count = 0;
		let startTime;
		let total;

		return get_api_instance().then(api_instance => {
			return sequelize.query('SELECT DISTINCT r1."secondaryArtist" FROM related_artist r1 LEFT JOIN related_artist r2 ON r1."secondaryArtist" = r2."primaryArtist" WHERE r2."primaryArtist" IS NULL;', { type: Sequelize.QueryTypes.SELECT })
				.then(results => {
					console.log(`Fetching related artists for artists ${chalk.yellow(results.length)}`);
					total = results.length;
					startTime = now('milli');
					return results.map(result => result.secondaryArtist);
				})
				.then(artist_ids => Promise.map(artist_ids, id => Promise.all([
					id,
					sleep(50).then(() => api_instance.request(getRelatedArtistConfig(id))).catch(err => {
						console.error(pe.render(err));
						return Promise.resolve(false);
					}).then(result => result.artists),
				]).then(result => {
					if (result[1]) {
						const primaryArtist = result[0];
						const artists = result[1].map(artist => ({
							id: artist.id,
							href: artist.href,
							name: artist.name,
							popularity: artist.popularity,
							type: artist.type,
							uri: artist.uri,
							createdAt: new Date(),
							updatedAt: new Date(),
						}));
						const relatedArtists = result[1].map(artist => ({
							primaryArtist,
							secondaryArtist: artist.id,
							createdAt: new Date(),
							updatedAt: new Date(),
						}));
						return Artist.bulkCreate(artists, { ignoreDuplicates: true })
							.then(() => RelatedArtist.bulkCreate(relatedArtists, { ignoreDuplicates: true }))
							.catch(err => {
								console.error(pe.render(err));
								failed_results.push(primaryArtist);
							})
							.then(() => {
								artistCount = artistCount + artists.length;
								relatedCount = relatedCount + relatedArtists.length;
								iter_count = iter_count + 1;
								const avg_time = (now('milli') - startTime) / iter_count;
								const est_complete = (total - iter_count) * avg_time;
								console.log(`Loaded chunk ${primaryArtist} | Avg time: ${avg_time.toFixed(2)} ms | Est. complete: ${est_complete.toFixed(2)} ms`);
							});
					} else {
						failed_results.push(result[0]);
						return Promise.resolve();
					}
				}), {
					concurrency: 1,
				}))
				.then(() => console.log(`Loaded new artists: [${chalk.green(artistCount)}]. Loaded "related artist" rows: [${chalk.green(relatedCount)}]`))
				.then(() => resolve());
		}).catch(err => reject(err));
	});
};

if (require.main === module) {
	main();
}

module.exports = main;