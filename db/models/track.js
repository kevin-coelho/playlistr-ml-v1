'use strict';
module.exports = (sequelize, DataTypes) => {
	const Track = sequelize.define('Track', {
		disc_number: DataTypes.INTEGER,
		duration_ms: DataTypes.INTEGER,
		explicit: DataTypes.BOOLEAN,		
		href: DataTypes.TEXT,
		is_playable: DataTypes.BOOLEAN,
		name: DataTypes.TEXT,
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
		//has many artists
		// has many available markets
		Track.hasMany(models.ExternalUrl, {
			onDelete: 'cascade',
			hooks: 'true',
		});
		Track.hasMany(models.Restriction, {
			onDelete: 'cascade',
			hooks: 'true',
		});
		Track.hasMany(models.ExternalId, {
			onDelete: 'cascade',
			hooks: 'true',			
		});
	};
	return Track;
};