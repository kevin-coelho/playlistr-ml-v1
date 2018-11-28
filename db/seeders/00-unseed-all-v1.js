/*jshint esversion: 6, node: true*/
'use strict';

// DEPENDENCIES
const chalk = require('chalk');
const fs = require('fs');
const Promise = require('bluebird');
const PrettyError = require('pretty-error');
const pe = new PrettyError();
const models = require('../models');

module.exports = {
	up: (queryInterface, Sequelize) => Promise.resolve(),
	down: (queryInterface, Sequelize) => {
		/*
		  Add reverting commands here.
		  Return a promise to correctly handle asynchronicity.

		  Example:
		  return queryInterface.bulkDelete('Person', null, {});
		*/
		console.log('Unseeding all...');
		return queryInterface.bulkDelete('related_artist', {})
			.then(() => console.log('Removed related artists.'))
			.then(() => queryInterface.bulkDelete('Artists', {}))
			.then(() => console.log('Removed artists.'));
	},
};