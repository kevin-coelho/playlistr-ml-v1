'use strict';
module.exports = (sequelize, DataTypes) => {
	const Playlist = sequelize.define('Playlist', {
		id: {
			type: DataTypes.TEXT,
			primaryKey: true,
		},
		collaborative: DataTypes.BOOLEAN,
		description: DataTypes.TEXT,
		href: DataTypes.TEXT,
		name: DataTypes.TEXT,
		public: DataTypes.BOOLEAN,
		snapshot_id: DataTypes.TEXT,
		type: DataTypes.TEXT,
		uri: DataTypes.TEXT,
	}, {
		timestamps: true,
	});
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
		Playlist.belongsToMany(models.Track, {
			as: 'playlist',
			through: 'playlist_track',
		});
	};
	return Playlist;
};
