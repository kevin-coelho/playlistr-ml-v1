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
		Playlist.belongsToMany(models.Track, {
			as: 'playlist',
			through: 'playlist_track',
			onDelete: 'set null',
			onUpdate: 'cascade',
		});
		Playlist.belongsToMany(models.DataSet, {
			as: 'dataset_playlists',
			through: 'dataset_playlist',
			onDelete: 'set null',
			onUpdate: 'cascade',
		});
		Playlist.belongsTo(models.User, {
			foreignKey: 'ownerId',
		});
	};
	return Playlist;
};
