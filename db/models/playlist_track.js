'use strict';
module.exports = (sequelize, DataTypes) => {
	const PlaylistTrack = sequelize.define('PlaylistTrack', {
		playlistId: {
			type: DataTypes.TEXT,
			references: {
				model: 'Playlist',
				key: 'id',
			},
		},
		trackId: {
			type: DataTypes.TEXT,
			references: {
				model: 'Track',
				key: 'id',
			},
		},
	}, {
		freezeTableName: true,
		tableName: 'playlist_track',
	});
	PlaylistTrack.associate = function(models) {

	};
	return PlaylistTrack;
};