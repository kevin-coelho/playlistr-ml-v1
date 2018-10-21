'use strict';
module.exports = (sequelize, DataTypes) => {
	const Restriction = sequelize.define('Restriction', {
		reason: DataTypes.TEXT
	}, {});
	Restriction.associate = function(models) {
		// associations can be defined here
	};
	return Restriction;
};