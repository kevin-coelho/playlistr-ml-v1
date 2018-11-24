/*jshint esversion: 6, node: true*/
'use strict';

const {
	create_user_playlists,
	create_user_tracks,
	create_user_audio_features,
//	create_user_audio_analyses,
	create_user_track_external_ids,
	create_user_playlist_track,
	create_user_artists,
	create_user_genres,
	create_user_related_artists,
	create_user_data_set,
} = require('../seeder-helpers');

console.log(create_user_playlists);

module.exports = {
	up: (queryInterface, Sequelize) => {
		return create_user_playlists.up(queryInterface, Sequelize)
			.then(() => create_user_tracks.up(queryInterface, Sequelize))
			.then(() => create_user_audio_features.up(queryInterface, Sequelize))
//			.then(() => create_user_audio_analyses.up(queryInterface, Sequelize))
			.then(() => create_user_track_external_ids.up(queryInterface, Sequelize))
			.then(() => create_user_playlist_track.up(queryInterface, Sequelize))
			.then(() => create_user_artists.up(queryInterface, Sequelize))
			.then(() => create_user_genres.up(queryInterface, Sequelize))
			.then(() => create_user_related_artists.up(queryInterface, Sequelize))
			.then(() => create_user_data_set.up(queryInterface, Sequelize));
	},
	down: (queryInterface, Sequelize) => {
		return create_user_playlists.down(queryInterface, Sequelize)
			.then(() => create_user_data_set.down(queryInterface, Sequelize))		
			.then(() => create_user_related_artists.down(queryInterface, Sequelize))
			.then(() => create_user_genres.down(queryInterface, Sequelize))

			.then(() => create_user_tracks.down(queryInterface, Sequelize))
			.then(() => create_user_audio_features.down(queryInterface, Sequelize))
//			.then(() => create_user_audio_analyses.down(queryInterface, Sequelize))
			.then(() => create_user_track_external_ids.down(queryInterface, Sequelize))
			.then(() => create_user_playlist_track.down(queryInterface, Sequelize))
			.then(() => create_user_artists.down(queryInterface, Sequelize))


	},
};