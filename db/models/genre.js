'use strict';
module.exports = (sequelize, DataTypes) => {
	const Genre = sequelize.define('Genre', {
		name: DataTypes.TEXT,
	}, {});
	Genre.associate = function(models) {
		// associations can be defined here
	};
	return Genre;
};