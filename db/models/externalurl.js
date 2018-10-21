'use strict';
module.exports = (sequelize, DataTypes) => {
	const ExternalUrl = sequelize.define('ExternalUrl', {
		key: DataTypes.TEXT,
		value: DataTypes.TEXT,
	}, {});
	ExternalUrl.associate = function(models) {
		// associations can be defined here
	};
	return ExternalUrl;
};