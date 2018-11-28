const chalk = require('chalk');

console.log('Seeder helpers imported...');

module.exports = {
	create_user_playlists: require('./create-user-playlists'),
	create_user_tracks: require('./create-user-tracks'),
	create_user_audio_features: require('./create-user-audio-features'),
//	create_user_audio_analyses: require('./create-user-audio-analyses'),
	create_user_track_external_ids: require('./create-user-track-external-ids'),
	create_user_playlist_track: require('./create-user-playlist-track'),
	create_user_artists: require('./create-user-artists'),
	create_user_genres: require('./create-user-genres'),
	create_user_related_artists: require('./create-user-related-artists'),
	create_user_data_set: require('./create-user-data-set'),
};