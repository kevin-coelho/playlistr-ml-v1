'use strict';
module.exports = (sequelize, DataTypes) => {
	const PlaylistOwner = sequelize.define('PlaylistOwner', {
		playlistId: {
			type: DataTypes.TEXT,
			references: {
				model: 'Playlist',
				key: 'id',
			},
		},
		ownerId: {
			type: DataTypes.TEXT,
			references: {
				model: 'User',
				key: 'id',
			},
		},
	}, {
		freezeTableName: true,
		tableName: 'playlist_owner',
	});
	PlaylistOwner.associate = function(models) {

	};
	return PlaylistOwner;
};