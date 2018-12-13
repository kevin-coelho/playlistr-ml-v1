const chalk = require('chalk');
const fs = require('fs');
const Promise = require('bluebird');
const models = require('../models');
const Album = models.Album;
const Artist = models.Artist;
const ArtistAlbum = models.ArtistAlbum;

// CONSTANTS
const album_include_keys = [
	'id',
	'href',
	'release_date',
	'release_date_precision',
	'total_tracks',
	'name',
	'album_type',
	'type',
	'uri',
];

const artist_include_keys = [
	'id',
	'href',
	'name',
	'popularity',
	'type',
	'uri',
];

module.exports = (data_file) => {
	if (!fs.existsSync(data_file)) throw new Error(`[${data_file}] Data file not found.`);
	console.log(`[${chalk.yellow(data_file)}] Starting seed with tracks data file...`);
	const data = JSON.parse(fs.readFileSync(data_file));

	const albums = data.reduce((a, playlist) => {
		a.push(...playlist.tracks.map(playlist_track => playlist_track.track.album).filter(album => album.id));
		return a;
	}, [])
		.map(album => {
			return Object.keys(album)
				.filter(key => album_include_keys.includes(key))
				.reduce((filteredObj, key) => {
					filteredObj[key] = album[key];
					filteredObj['createdAt'] = new Date();
					filteredObj['updatedAt'] = new Date();
					return filteredObj;
				}, {});
		})
		.filter((album, idx, self) => self.findIndex(elem => elem.id === album.id) === idx);

	const artists = data.reduce((a, playlist) => {
		a.push(...playlist.tracks.map(playlist_track => playlist_track.track.album).reduce((a, album) => {
			a.push(...album.artists.reduce((a, artist) => {
				a.push(Object.keys(artist).filter(key => artist_include_keys.includes(key)).reduce((a, key) => {
					a[key] = artist[key];
					a.createdAt = new Date();
					a.updatedAt = new Date();
					return a;
				}, {}));
				return a;
			}, []));
			return a;
		}, []));
		return a;
	}, [])
		.filter((artist, idx, self) => self.findIndex(elem => elem.id === artist.id) == idx);


	const artist_albums = data.reduce((a, playlist) => {
		a.push(...playlist.tracks.map(playlist_track => playlist_track.track.album).reduce((a, album) => {
			a.push(...album.artists.reduce((a, artist) => {
				a.push({
					albumId: album.id,
					artistId: artist.id,
					createdAt: new Date(),
					updatedAt: new Date(),
				});
				return a;
			}, []));
			return a;
		}, []));
		return a;
	}, []);

	return {
		up: (queryInterface, Sequelize) => {
			return Promise.map(albums, album => Album.bulkCreate([album], { ignoreDuplicates: true })
				.catch((err) => {
					console.log(`Insert failed for album ${chalk.red(album.id)}`);
					console.log(`${chalk.red('Seed failed.')}`, err.parent);
					return Promise.reject(err);
				}))
				.then(() => Promise.map(artists, artist => Artist.bulkCreate([artist], { ignoreDuplicates: true })
					.catch(() => console.log(`Insert failed for artist ${chalk.red(artist.id)}`))))
				.then(() => Promise.map(artist_albums, artist_album => ArtistAlbum.bulkCreate([artist_album], { ignoreDuplicates: true })
					.catch(() => console.log(`Insert failed for artist album ${chalk.red(artist_album.artistId)}, ${chalk.red(artist_album.albumId)}`))))
				.then(console.log(`${chalk.green('Seed Success')} Artists seeded: ${chalk.green(artists.length)}`))
				.then(console.log(`${chalk.green('Seed Success')} Albums artist relations seeded: ${chalk.green(artist_albums.length)}`))
				.then(console.log(`${chalk.green('Seed Success')} Albums seeded: ${chalk.green(albums.length)}`))
				.catch(err => {
					console.log(`${chalk.red('Seed failed.')}`, err.parent);
					return Promise.reject(err);
				});
		},
		down: (queryInterface, Sequelize) => {
			/*
			  Add reverting commands here.
			  Return a promise to correctly handle asynchronicity.

			  Example:
			  return queryInterface.bulkDelete('Person', null, {});
			*/
			return queryInterface.bulkDelete('artist_album', {}, {})
				.then(() => queryInterface.bulkDelete('Albums', {}, {}))
				.then(() => console.log('Removed artist_album relations and Albums'));
		}
	};
};
