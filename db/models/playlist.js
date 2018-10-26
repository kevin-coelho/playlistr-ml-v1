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
		createdAt: {
			type: DataTypes.DATE,
			field: 'beginTime',
			defaultValue: sequelize.literal('NOW()'),
		},
		updatedAt: {
			type: DataTypes.DATE,
			field: 'beginTime',
			defaultValue: sequelize.literal('NOW()'),
		}
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
		Playlist.hasMany(models.Track, {
			hooks: 'false',
		});
	};
	return Playlist;
};