/*jshint esversion: 6, node: true*/
'use strict';

const chalk = require('chalk');
const fs = require('fs');
const toy_path = '../get_toy_set/results/toy_data_set_playlists_full.json';
const toy_playlists = (() => {
	if (fs.existsSync(toy_path)) return JSON.parse(fs.readFileSync(toy_path));
	return null;
})();
const Promise = require('bluebird');
const models = require('../models');
const ArtistTrack = models.ArtistTrack;

const filtered = toy_playlists.reduce((a, playlist) => {
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
}, []).filter((elem, idx, arr) => idx === arr.findIndex(e => e.trackId == elem.trackId && e.artistId == elem.artistId));

module.exports = {
	up: (queryInterface, Sequelize) => {
		return ArtistTrack.bulkCreate(filtered, { ignoreDuplicates: true })
			.catch(err => console.error(err.parent.detail))
			.then(() => console.log(`${chalk.green('Seed Success')} artist_track associations seeded: ${chalk.green(filtered.length)}`));
	},

	down: (queryInterface, Sequelize) => {
		/*
		  Add reverting commands here.
		  Return a promise to correctly handle asynchronicity.

		  Example:
		  return queryInterface.bulkDelete('Person', null, {});
		*/
		const Op = Sequelize.Op;
		return queryInterface.bulkDelete('artist_track', {
			[Op.or]: filtered.map(artist_track => ({
				trackId: artist_track.trackId,
				artistId: artist_track.artistId,
			})),
		}, {}).then(() => console.log(`Removed toy set artist track linkings. Count: ${chalk.red(filtered.length)}`));
	}
};