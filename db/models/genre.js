'use strict';
module.exports = (sequelize, DataTypes) => {
	const Genre = sequelize.define('Genre', {
		name: {
			type: DataTypes.TEXT,
			primaryKey: true,
		},
	}, {});
	Genre.associate = function(models) {
		// associations can be defined here
	};
	return Genre;
};