const chalk = require('chalk');
const fs = require('fs');
const Promise = require('bluebird');
const models = require('../models');
const Playlist = models.Playlist;
const User = models.User;

// CONSTANTS
const include_keys = [
	'id',
	'name',
	'collaborative',
	'description',
	'href',
	'name',
	'primary_color',
	'public',
	'snapshot_id',
	'type',
	'uri',
	'createdAt',
	'updatedAt',
];

module.exports = (data_file) => {
	if (!fs.existsSync(data_file)) throw new Error(`[${data_file}] Data file not found.`);
	console.log(`[${chalk.yellow(data_file)}] Starting seed with playlist data file...`);
	const playlists_data = JSON.parse(fs.readFileSync(data_file));

	const playlists = playlists_data.map(playlist => {
		return Object.keys(playlist)
			.filter(key => include_keys.includes(key))
			.reduce((filteredObj, key) => {
				filteredObj[key] = playlist[key];
				filteredObj.createdAt = new Date();
				filteredObj.updatedAt = new Date();
				filteredObj.ownerId = playlist.owner.id;
				return filteredObj;
			}, {});
	})
		.filter((obj, idx, self) => self.findIndex(elem => elem.id === obj.id) === idx);

	const users = playlists_data.map(playlist => playlist.owner).map(user => {
		delete user.external_urls;
		user.createdAt = new Date();
		user.updatedAt = new Date();
		return user;
	});

	return {
		up: (queryInterface, Sequelize) => {
			return User.bulkCreate(users, { ignoreDuplicates: true })
				.then(() => Playlist.bulkCreate(playlists, { ignoreDuplicates: true }))
				.catch(err => {
					console.log(`${chalk.red('Seed failed.')}`, err.parent);
					return Promise.reject(err);
				})
				.then(console.log(`${chalk.green('Seed success')} Users seeded: ${chalk.green(users.length)}`))
				.then(console.log(`${chalk.green('Seed success')} Playlists seeded: ${chalk.green(playlists.length)}`));
		},
		down: (queryInterface, Sequelize) => {
			console.log(`${chalk.red('Create playlist has no unseed due to dependencies. Remove all dependencies then re-run.')}`);
			return Promise.resolve();
			/*
			const Op = Sequelize.Op;
			return queryInterface.bulkDelete('Playlists', {
				id: {
					[Op.or]: playlists.map(playlist => playlist.id),
				},
			}, {})
				.then(() => queryInterface.bulkDelete('Users', {
					id: {
						[Op.or]: users.map(user => user.id),
					},
				}))
				.then(() => console.log(`Removed playlists. Count: ${chalk.yellow(playlists.length)}`))
				.then(() => console.log(`Removed users. Count: ${chalk.yellow(users.length)}`));*/
		},
	};
};
