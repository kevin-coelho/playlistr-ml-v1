// CONSTANTS
const toy_path = '../get_toy_set/toy_data_set_playlist_ids.json';
const dataset_name = 'spotify_toy_data_set';

// MODULE DEPS
const { up, down } = require('../seeder-helpers/create-data-set')(toy_path, dataset_name);

module.exports = { up, down };