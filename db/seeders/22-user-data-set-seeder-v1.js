// CONSTANTS
const user_path = '../get_user_set/user_data_set_playlist_ids.json';
const dataset_name = 'spotify_user_data_set';

// MODULE DEPS
const { up, down } = require('../seeder-helpers/create-data-set')(user_path, dataset_name);

module.exports = { up, down };