/*jshint esversion: 6, node: true*/
'use strict';

// DEPENDENCIES
const chalk = require('chalk');
const PrettyError = require('pretty-error');
const pe = new PrettyError();
const fs = require('fs');
const Promise = require('bluebird');
const assert = require('chai').assert;
const models = require('../models');
const Artist = models.Artist;
const RelatedArtist = models.RelatedArtist;
const Genre = models.Genre;
const ArtistGenre = models.ArtistGenre;
const sequelize = models.sequelize;
const Sequelize = models.Sequelize;


// MODULE DEPS
const { getRelatedArtistConfig } = require('../../get_spotify/util');
const { sleep, now } = require('../../utils');

// FUNCTIONS
const generate_related_query = (dataset_name, related_artist_degree) => {
	const select = `SELECT DISTINCT r${related_artist_degree - 1}."secondaryArtist"\n`;
	let from_table = `
FROM dataset_playlist p1
INNER JOIN playlist_track ptr ON p1."playlistId" = ptr."playlistId"
INNER JOIN artist_track atr ON ptr."trackId" = atr."trackId"
INNER JOIN related_artist r1 ON atr."artistId" = r1."primaryArtist"
	`.trim();
	for (let i = 2; i <= related_artist_degree; i++) {
		from_table += `\n${i == related_artist_degree ? 'LEFT JOIN' : 'INNER JOIN'} related_artist r${i} ON r${i - 1}."secondaryArtist" = r${i}."primaryArtist"`;
	}
	from_table += `\nWHERE r${related_artist_degree}."primaryArtist" IS NULL`;
	from_table += `\nAND p1."datasetName" = '${dataset_name}'`;
	from_table += ';';
	return select + from_table;
};

const main = async (dataset_name, related_degrees, outfile) => {
	// HANDLE USER KILL
	process.on('SIGINT', () => {
		console.log('Closed writestream, exiting...');
		fs.appendFileSync(outfile, ']');
		process.exit(0);
	});

	// WRITESTREAMING
	let newFile = false;
	if (!fs.existsSync(outfile)) {
		console.log(`[${chalk.yellow(outfile)}] Outfile not found. Creating...`);
		fs.writeFileSync(outfile, '[]');
		newFile = true;
	}
	const stats = fs.statSync(outfile);
	let start = stats.size - 1;
	const out = fs.createWriteStream(outfile, {
		start,
		flags: 'r+',
	});
	if (!newFile) {
		out.write(',');
	}
	let sep = '';

	console.log('Starting...');
	const get_api_instance = require('../../api_manager').spotify;
	const failed_results = [];
	let artistCount = 0;
	let relatedCount = 0;
	let iter_count = 0;
	let startTime;
	let total;

	return get_api_instance().then(api_instance => {
		const query = generate_related_query('spotify_user_data_set', related_degrees);
		console.log('Executing query...\n', chalk.yellow(query));
		return sequelize.query(query, { type: Sequelize.QueryTypes.SELECT })
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
					if (result[1] && result[1].length < 1) {
						console.log(`[${chalk.yellow(result[0])}] No related artists found.`);
						failed_results.push(result[0]);
						return Promise.resolve();
					} else if (result[1]) {
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
							.then(() => Promise.map(relatedArtists, artist_relation => RelatedArtist.bulkCreate([artist_relation], { ignoreDuplicates: true })
								.catch(err => console.error(err.parent.error)), { concurrency: 4 }))
							.then(() => Genre.bulkCreate(genres, { ignoreDuplicates: true }))
							.catch(err => {
								console.error(err.parent.error);
								return Promise.reject(err);
							})
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
								let msg = `Loaded chunk ${primaryArtist}`;
								if (iter_count % 50 == 0) {
									const avg_time = (now('milli') - startTime) / iter_count;
									const est_complete = (total - iter_count) * avg_time;
									msg += ` | Avg time: ${avg_time.toFixed(2)} ms | Est. complete: ${est_complete.toFixed(2)} ms`;
								}
								console.log(msg);
							});

						return db_promise.then(() => Promise.each(result[1], artist => {
							const write_res = out.write(`${sep}\n[${JSON.stringify(primaryArtist)}, ${JSON.stringify(artist)}]`);
							if (!sep) sep = ',';
							if (!write_res) {
								console.log(chalk.yellow('Bad write, waiting for drain...'));
								return new Promise((resolve, reject) => {
									out.once('drain', () => resolve());
								});
							}
							return Promise.resolve();
						}));
					} else {
						failed_results.push(result[0]);
						return Promise.resolve();
					}
				}), { concurrency: 1, }))
			.then(() => {
				const write_res = out.write(']');
				if (!write_res) {
					return new Promise((resolve, reject) => {
						out.once('drain', () => resolve());
					});
				}
				return Promise.resolve();
			})
			.then(() => console.log(`Loaded new artists: [${chalk.green(artistCount)}]. Loaded "related artist" rows: [${chalk.green(relatedCount)}]`))
			.then(() => failed_results.length > 0 ? console.log(`Failed to load artists: [${chalk.red(failed_results.length)}]. Re-run script.`) : true);
	});
};

if (require.main === module) {
	try {
		const args = process.argv.slice(2);
		if (args.length == 0) {
			console.log(`Usage: node get_extended_related_artists.js <${chalk.yellow('dataset_name')}> <${chalk.yellow('related_degrees')}> <${chalk.yellow('outfile')}>`);
			process.exit(0);
		}
		assert.equal(args.length, 3, 'Missing args. All 3 args are required: <dataset_name> <related_degrees> <outfile>');
		const dataset_name = args[0];
		const degrees = parseInt(args[1]);
		const outfile = args[2];
		assert.isOk(degrees, '<related_degrees> argument must be a valid integer.');
		main(dataset_name, degrees, outfile);
	} catch (err) {
		console.error(pe.render(err));
	}
}

module.exports = main;