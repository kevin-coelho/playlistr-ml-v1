// CONSTANTS
const user_path = '../get_user_set/results/user_data_set_artists.json';

// MODULE DEPS
const { up } = require('../seeder-helpers/create-genres')(user_path);

module.exports = { up, down: () => Promise.resolve(), };