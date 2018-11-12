'use strict';
module.exports = (sequelize, DataTypes) => {
	const Track = sequelize.define('Track', {
		href: DataTypes.TEXT,
		is_playable: DataTypes.BOOLEAN,
		name: DataTypes.TEXT,
		disc_number: DataTypes.INTEGER,
		duration_ms: DataTypes.INTEGER,
		explicit: DataTypes.BOOLEAN,
		popularity: DataTypes.INTEGER,
		preview_url: DataTypes.TEXT,
		track_number: DataTypes.INTEGER,
		type: DataTypes.TEXT,
		uri: DataTypes.TEXT,
		is_local: DataTypes.BOOLEAN,
	}, {});
	Track.associate = function(models) {
		// associations can be defined here
		//has one album
		Track.belongsToOne(models.Album, {
			onDelete: 'set null',
			hooks: 'true',
		});
		//has many artists
		Track.belongsToMany(models.Artist, {
			as: 'track',
			through: 'track_artist',
		});
		Track.belongsToMany(models.Playlist, {
			as: 'track',
			through: 'playlist_track',
		});
		Track.belongsToMany(models.AvailableMarket, {
			as: 'track',
			through: 'track_market',
		});
		Track.hasMany(models.ExternalUrl, {
			through: 'track_external_url',
			onDelete: 'cascade',
			hooks: 'true',
		});
		Track.hasMany(models.Restriction, {
			onDelete: 'cascade',
			hooks: 'true',
		});
		Track.hasMany(models.ExternalId, {
			through: 'track_external_id',
			onDelete: 'cascade',
			hooks: 'true',
		});
		Track.hasOne(models.AudioAnalysis, {
			onDelete: 'cascade',
			hooks: 'true',
		});
		Track.hasOne(models.AudioFeature, {
			onDelete: 'cascade',
			hooks: 'true',
		});
	};
	return Track;
};