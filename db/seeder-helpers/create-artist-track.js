/*jshint esversion: 6, node: true*/
'use strict';

const chalk = require('chalk');
const fs = require('fs');
const Promise = require('bluebird');
const models = require('../models');
const ArtistTrack = models.ArtistTrack;

module.exports = (data_file) => {
	if (!fs.existsSync(data_file)) throw new Error(`[${data_file}] Data file not found.`);
	console.log(`[${chalk.yellow(data_file)}] Starting seed with playlist data file...`);
	const playlists_data = JSON.parse(fs.readFileSync(data_file));

	const filtered = playlists_data.reduce((a, playlist) => {
		a.push(...playlist.tracks.map(playlist_track => playlist_track.track).reduce((a, track) => {
			a.push(...track.artists.reduce((a, artist) => {
				a.push({
					trackId: track.id,
					artistId: artist.id,
					createdAt: new Date(),
					updatedAt: new Date(),
				});
				return a;
			}, []));
			return a;
		}, []));
		return a;
	}, [])
		.filter((elem) => elem.trackId && elem.artistId)
		.filter((elem, idx, arr) => idx === arr.findIndex(e => e.trackId == elem.trackId && e.artistId == elem.artistId));

	let count = filtered.length;

	return {
		up: (queryInterface, Sequelize) => {
			return Promise.map(filtered, artist_track => ArtistTrack.bulkCreate([artist_track], { ignoreDuplicates: true })
				.catch(err => {
					count = count - 1;
					console.error(chalk.red(`${err.parent.detail}`));
					return Promise.resolve();
				}), {
				concurrency: 4
			})
				.then(() => console.log(`${chalk.green('Seed Success')} artist_track associations seeded: ${chalk.green(count)}`));
		},

		down: (queryInterface, Sequelize) => {
			/*
			  Add reverting commands here.
			  Return a promise to correctly handle asynchronicity.

			  Example:
			  return queryInterface.bulkDelete('Person', null, {});
			*/
			return queryInterface.bulkDelete('artist_track', null, {})
				.then(() => console.log('Removed artist track linkings.'));
		}
	};
};