'use strict';
module.exports = (sequelize, DataTypes) => {
	const DataSet = sequelize.define('DataSet', {
		name: {
			type: DataTypes.TEXT,
			primaryKey: true,
		}
	}, {});
	DataSet.associate = function(models) {
		// associations can be defined here
		DataSet.belongsToMany(models.Playlist, {
			onDelete: 'set null',
			onUpdate: 'cascade',
			as: 'dataset',
			through: 'dataset_playlist',
		});
	};
	return DataSet;
};