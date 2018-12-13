// CONSTANTS
const user_path = '../get_user_set/results/extended_related_artists.json';

// MODULE DEPS
const { up } = require('../seeder-helpers/create-extended-related-artists')(user_path);

module.exports = { up, down: () => Promise.resolve(), };
