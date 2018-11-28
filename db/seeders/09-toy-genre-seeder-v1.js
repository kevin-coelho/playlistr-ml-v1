// CONSTANTS
const toy_path = '../get_toy_set/results/toy_data_set_artists.json';

// MODULE DEPS
const { up, down } = require('../seeder-helpers/create-genres')(toy_path);

module.exports = { up, down };