'use strict';
module.exports = (sequelize, DataTypes) => {
	const ArtistTrack = sequelize.define('ArtistTrack', {
		artistId: {
			type: DataTypes.TEXT,
			references: {
				model: 'Artist',
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
		tableName: 'artist_track',
	});
	ArtistTrack.associate = function(models) {

	};
	return ArtistTrack;
};