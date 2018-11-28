/*jshint esversion: 6, node: true*/
'use strict';

// DEPENDENCIES
const chalk = require('chalk');
const PrettyError = require('pretty-error');
const pe = new PrettyError();
const fs = require('fs');
const Promise = require('bluebird');
const models = require('../db/models');
const Artist = models.Artist;
const RelatedArtist = models.RelatedArtist;
const Genre = models.Genre;
const ArtistGenre = models.ArtistGenre;
const sequelize = models.sequelize;
const Sequelize = models.Sequelize;


// MODULE DEPS
const { getRelatedArtistConfig } = require('../get_spotify/util');
const { sleep, now } = require('../utils');

// CONSTANTS
const { extended_related_artists } = require('./constants');

// WRITESTREAMING
let newFile = false;
if (!fs.existsSync(extended_related_artists)) {
	fs.writeFileSync(extended_related_artists, '[]');
	newFile = true;
}
const stats = fs.statSync(extended_related_artists);
let start = stats.size - 1;
const out = fs.createWriteStream(extended_related_artists, {
	start,
	flags: 'r+',
});
if (!newFile) {
	out.write(',');
}
let sep = '';

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
						failed_results.push(id);
						console.error(pe.render(err));
						return Promise.resolve(false);
					}).then(result => result.artists),
				])
					.then(result => {
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
							const genres = result[1].map(artist => artist.genres).reduce((a, genre_arr) => {
								a.push(...genre_arr);
								return a;
							}, []).map(genre => ({
								name: genre,
								createdAt: new Date(),
								updatedAt: new Date()
							}));
							const artist_genres = result[1].reduce((a, artist) => {
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
							const db_promise = Artist.bulkCreate(artists, { ignoreDuplicates: true })
								.then(() => RelatedArtist.bulkCreate(relatedArtists, { ignoreDuplicates: true }))
								.then(() => Genre.bulkCreate(genres, { ignoreDuplicates: true }))
								.catch(err => console.error(err.parent.error))
								.then(() => Promise.map(artist_genres, artist_genre => ArtistGenre.bulkCreate([artist_genre], { ignoreDuplicates: true })
									.catch(err => {
										console.error(chalk.red(`${err.parent.detail}`));
										return Promise.resolve();
									}), { concurrency: 4 }))
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

							result[1].forEach(artist => {
								const write_res = out.write(`${sep}\n[${JSON.stringify(primaryArtist)}, ${JSON.stringify(artist)}]`);
								if (!sep) sep = ',';
								if (!write_res) {
									return new Promise((resolve, reject) => {
										out.once('drain', resolve);
									}).then(() => db_promise);
								}
								return db_promise;
							});
						} else {
							failed_results.push(result[0]);
							return Promise.resolve();
						}
					}), { concurrency: 1, }))
				.then(() => console.log(`Loaded new artists: [${chalk.green(artistCount)}]. Loaded "related artist" rows: [${chalk.green(relatedCount)}]`))
				.then(() => {
					const write_res = out.write(']');
					if (!write_res) {
						return new Promise((resolve, reject) => {
							out.once('drain', () => {
								out.write(']');
								resolve();
							});
						});
					}
					return Promise.resolve();
				})
				.then(() => {
					resolve();
				});
		}).catch(err => reject(err));
	});
};

process.on('SIGINT', () => {
	console.log('Closed writestream, exiting...');
	fs.appendFileSync(extended_related_artists, ']');
	process.exit(0);
});

if (require.main === module) {
	main();
}

module.exports = main;