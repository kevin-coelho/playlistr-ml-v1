'use strict';
module.exports = (sequelize, DataTypes) => {
	const TrackExternalId = sequelize.define('TrackExternalId', {
		externalId: {
			type: DataTypes.TEXT,
			references: {
				model: 'ExternalId',
				key: 'id',
			},
		},
		trackId: {
			type: DataTypes.TEXT,
			references: {
				model: 'Track',
				key: 'id',
			},
		},
	}, {
		freezeTableName: true,
		tableName: 'track_external_id',
	});
	TrackExternalId.associate = function(models) {

	};
	return TrackExternalId;
};