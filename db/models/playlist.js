'use strict';
module.exports = (sequelize, DataTypes) => {
	const Playlist = sequelize.define('Playlist', {
		id: DataTypes.TEXT,
		collaborative: DataTypes.BOOLEAN,
		description: DataTypes.TEXT,	
		href: DataTypes.TEXT,
		name: DataTypes.TEXT,
		public: DataTypes.BOOLEAN,
		snapshot_id: DataTypes.TEXT,
		type: DataTypes.TEXT,
		uri: DataTypes.TEXT,
	}, {});
	Playlist.associate = function(models) {
		// associations can be defined here
		Playlist.hasOne(models.ExternalUrl, {
			onDelete: 'cascade',
			hooks: 'true',
		});
		Playlist.hasOne(models.Followers, {
			onDelete: 'cascade',
			hooks: 'true',
		});
		Playlist.hasOne(models.Image, {
			onDelete: 'cascade',
			hooks: 'true',
		});
		Playlist.hasOne(models.Owner, {
			onDelete: 'cascade',
			hooks: 'true',			
		});
		// has many tracks
	};
	return Playlist;
};