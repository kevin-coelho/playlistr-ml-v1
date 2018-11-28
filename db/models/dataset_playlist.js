'use strict';
module.exports = (sequelize, DataTypes) => {
	const DataSetPlaylist = sequelize.define('DataSetPlaylist', {
		datasetName: {
			type: DataTypes.TEXT,
			allowNull: false,
			references: {
				model: 'DataSets',
				key: 'name',
			}
		},
		playlistId: {
			type: DataTypes.TEXT,
			allowNull: false,
			references: {
				model: 'Playlists',
				key: 'id',
			}
		},
	}, {
		freezeTableName: true,
		tableName: 'dataset_playlist',
	});
	DataSetPlaylist.associate = function(models) {
		// associations can be defined here
	};
	return DataSetPlaylist;
};