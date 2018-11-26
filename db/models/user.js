'use strict';
module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('User', {
		id: {
			type: DataTypes.TEXT,
			primaryKey: true,
		},
		display_name: DataTypes.TEXT,
		href: DataTypes.TEXT,
		type: DataTypes.TEXT,
		uri: DataTypes.TEXT
	}, {});
	User.associate = function(models) {
		// associations can be defined here
		User.hasOne(models.ExternalUrl, {
			onDelete: 'cascade',
			hooks: 'true',
		});
		User.hasMany(models.Playlist, {
			as: 'playlist_owner',
			foreignKey: 'ownerId',
		});
	};
	return User;
};