// CONSTANTS
const user_path = '../get_user_set/results/user_data_set_tracks_audio_analysis.json';

// MODULE DEPS
const { up } = require('../seeder-helpers/create-audio-analyses')(user_path);

module.exports = { up, down: () => Promise.resolve(), };