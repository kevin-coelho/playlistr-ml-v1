// CONSTANTS
const user_path = '../get_user_set/results/user_data_set_related_artists.json';

// MODULE DEPS
const { up } = require('../seeder-helpers/create-related-artists')(user_path);

module.exports = { up, down: () => Promise.resolve(), };