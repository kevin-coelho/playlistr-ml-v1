'use strict';
module.exports = (sequelize, DataTypes) => {
	const ArtistAlbum = sequelize.define('ArtistAlbum', {
		artistId: {
			type: DataTypes.TEXT,
			references: {
				model: 'Artist',
				key: 'id',
			},
		},
		albumId: {
			type: DataTypes.TEXT,
			references: {
				model: 'Track',
				key: 'id',
			},
		},
	}, {
		freezeTableName: true,
		tableName: 'artist_album',
	});
	ArtistAlbum.associate = function(models) {

	};
	return ArtistAlbum;
};
