'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('dataset_playlist', {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			datasetName: {
				type: Sequelize.TEXT,
				allowNull: false,
				references: {
					model: 'DataSets',
					key: 'name',
				}
			},
			playlistId: {
				type: Sequelize.TEXT,
				allowNull: false,
				references: {
					model: 'Playlists',
					key: 'id',
				}
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('dataset_playlist');
	}
};