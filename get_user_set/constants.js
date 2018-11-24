const user_id_file = './user_data_set_playlist_ids.json';
const results_dir = './results';
const user_playlists_full = './results/user_data_set_playlists_full.json';
const user_playlists_audio_analysis = './results/user_data_set_tracks_audio_analysis.json';
const user_playlists_audio_features = './results/user_data_set_tracks_audio_features.json';
const audio_features_errors = './results/audio_features_errors.json';
const audio_analysis_errors = './results/audio_analysis_errors.json';
const artists_errors = './results/artists_errors.json';
const user_playlists_artists = './results/user_data_set_artists.json';
const user_playlists_related_artists = './results/user_data_set_related_artists.json';

module.exports = {
	user_id_file,
	user_playlists_full,
	user_playlists_audio_analysis,
	user_playlists_audio_features,
	audio_features_errors,
	audio_analysis_errors,
	user_playlists_artists,
	artists_errors,
	user_playlists_related_artists,
	results_dir,
};