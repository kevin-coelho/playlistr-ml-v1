// CONSTANTS
const toy_path = '../get_toy_set/results/toy_data_set_tracks_audio_features.json';

// MODULE DEPS
const { up, down } = require('../seeder-helpers/create-audio-features')(toy_path);

module.exports = { up, down };