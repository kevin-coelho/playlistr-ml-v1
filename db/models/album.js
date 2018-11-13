'use strict';
module.exports = (sequelize, DataTypes) => {
	const Album = sequelize.define('Album', {
		album_type: DataTypes.TEXT,
		href: DataTypes.TEXT,
		label: DataTypes.TEXT,
		name: DataTypes.TEXT,
		popularity: DataTypes.INTEGER,
		release_date: DataTypes.TEXT,
		release_date_precision: DataTypes.TEXT,
		type: DataTypes.TEXT,
		uri: DataTypes.TEXT
	}, {});
	Album.associate = function(models) {
		// associations can be defined here
		Album.belongsToMany(models.Artist, {
			through: 'album_artist',
			hooks: 'false',
		});
		Album.belongsToMany(models.AvailableMarket, {
			through: 'album_market',
			hooks: 'false',
		});
		//has many copyrights
		Album.hasMany(models.ExternalUrl, {
			onDelete: 'cascade',
			hooks: 'true',
		});
		Album.hasMany(models.Restriction, {
			onDelete: 'cascade',
			hooks: 'true',
		});
		Album.hasMany(models.ExternalId, {
			onDelete: 'cascade',
			hooks: 'true',
		});
		//has many genres
		Album.hasMany(models.Image, {
			onDelete: 'cascade',
			hooks: 'true',
		});
		Album.hasMany(models.Track, {
			onDelete: 'cascade',
			hooks: 'true',
		});
	};
	return Album;
};