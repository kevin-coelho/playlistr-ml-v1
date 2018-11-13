'use strict';
module.exports = (sequelize, DataTypes) => {
	const ExternalId = sequelize.define('ExternalId', {
		id: {
			type: DataTypes.TEXT,
			primaryKey: true,
		},		
		key: DataTypes.TEXT,
		value: DataTypes.TEXT
	}, {});
	ExternalId.associate = function(models) {
		// associations can be defined here
		ExternalId.belongsTo(models.Track, {
			as: 'external_id',
			through: 'track_external_id',
		});
	};
	return ExternalId;
};