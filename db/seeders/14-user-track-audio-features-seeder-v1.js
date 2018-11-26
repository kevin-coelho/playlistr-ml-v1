// CONSTANTS
const user_path = '../get_user_set/results/user_data_set_tracks_audio_features.json';

// MODULE DEPS
const { up } = require('../seeder-helpers/create-audio-features')(user_path);

module.exports = { up, down: () => Promise.resolve(), };