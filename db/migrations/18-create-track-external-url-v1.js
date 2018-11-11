'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('track_external_url', {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			externalUrl: {
				type: Sequelize.UUID,
				allowNull: false,
				references: {
					model: 'ExternalUrls',
					key: 'id',
				}
			},
			trackId: {
				type: Sequelize.TEXT,
				allowNull: false,
				references: {
					model: 'Tracks',
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
		return queryInterface.dropTable('track_external_url');
	}
};