'use strict';
module.exports = (sequelize, DataTypes) => {
	const ArtistGenre = sequelize.define('ArtistGenre', {
		artistId: {
			type: DataTypes.TEXT,
			references: {
				model: 'Artist',
				key: 'id',
			},
		},
		genre: {
			type: DataTypes.TEXT,
			references: {
				model: 'Genre',
				key: 'name',
			},
		},
	}, {
		freezeTableName: true,
		tableName: 'artist_genre',
	});
	ArtistGenre.associate = function(models) {

	};
	return ArtistGenre;
};