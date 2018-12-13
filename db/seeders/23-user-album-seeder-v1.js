// CONSTANTS
const user_path = '../get_user_set/results/user_data_set_playlists_full.json';

// MODULE DEPS
const { up, down } = require('../seeder-helpers/create-albums')(user_path);

module.exports = { up, down };
