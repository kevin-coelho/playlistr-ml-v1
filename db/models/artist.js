'use strict';
module.exports = (sequelize, DataTypes) => {
	const Artist = sequelize.define('Artist', {
		id: {
			type: DataTypes.TEXT,
			primaryKey: true,
		},
		href: DataTypes.TEXT,
		name: DataTypes.TEXT,
		popularity: DataTypes.INTEGER,
		type: DataTypes.TEXT,
		uri: DataTypes.TEXT
	}, {});
	Artist.associate = function(models) {
		// associations can be defined here
		Artist.hasMany(models.ExternalUrl, {
			onDelete: 'cascade',
			hooks: 'true',
		});
		Artist.hasOne(models.Followers, {
			onDelete: 'cascade',
			hooks: 'true',
		});
		Artist.hasMany(models.Image, {
			onDelete: 'cascade',
			hooks: 'true',
		});
		Artist.hasMany(models.Genre, {
			onDelete: 'set null',
			hooks: 'false',
		});
		Artist.belongsToMany(models.Artist, {
			as: 'related',
			through: 'related_artist',
		});
	};
	return Artist;
};