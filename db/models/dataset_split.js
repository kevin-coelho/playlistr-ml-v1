'use strict';
module.exports = (sequelize, DataTypes) => {
	const DataSetSplit = sequelize.define('DataSetSplit', {
		splitId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		trackId: {
			type: DataTypes.TEXT,
			allowNull: false,
			references: {
				model: 'Track',
				key: 'id',
			},
			primaryKey: true,
		},
		dataSet: {
			type: DataTypes.TEXT,
			allowNull: false,
			references: {
				model: 'DataSet',
				key: 'name',
			},
		},
		label: {
			type: DataTypes.TEXT,
			allowNull: false,
			validate: {
				isIn: [['train', 'eval', 'test']],
			},
		},
	});
	DataSetSplit.associate = function(models) {
		// associations can be defined here
	};
	return DataSetSplit;
};