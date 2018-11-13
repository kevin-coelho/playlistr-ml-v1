'use strict';
module.exports = (sequelize, DataTypes) => {
	const RelatedArtist = sequelize.define('RelatedArtist', {
		primaryArtist: {
			type: DataTypes.TEXT,
			primaryKey: true,
			references: {
				model: 'Artist',
				key: 'id'
			},
		},
		secondaryArtist: {
			type: DataTypes.TEXT,
			references: {
				model: 'Artist',
				key: 'id',
			},
		}
	}, {
		freezeTableName: true,
		// define the table's name
		tableName: 'related_artist',
		indexes: [
			{
				unique: true,
				fields: ['primaryArtist', 'secondaryArtist'],
			}
		],
	});
	RelatedArtist.associate = function(models) {
		// associations can be defined here
	};
	return RelatedArtist;
};