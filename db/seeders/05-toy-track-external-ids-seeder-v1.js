// CONSTANTS
const toy_path = '../get_toy_set/results/toy_data_set_playlists_full.json';

// MODULE DEPS
const { up, down } = require('../seeder-helpers/create-external-ids')(toy_path);

module.exports = { up, down };