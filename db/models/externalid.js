'use strict';
module.exports = (sequelize, DataTypes) => {
	const ExternalId = sequelize.define('ExternalId', {
		key: DataTypes.TEXT,
		value: DataTypes.TEXT
	}, {});
	ExternalId.associate = function(models) {
		// associations can be defined here
	};
	return ExternalId;
};