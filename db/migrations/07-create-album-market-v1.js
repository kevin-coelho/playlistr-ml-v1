'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('album_market', {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			marketCode: {
				type: Sequelize.STRING(2),
				allowNull: false,
				references: {
					model: 'AvailableMarkets',
					key: 'code',
				}
			},
			albumId: {
				type: Sequelize.TEXT,
				allowNull: false,
				references: {
					model: 'Albums',
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
		return queryInterface.dropTable('album_market');
	}
};