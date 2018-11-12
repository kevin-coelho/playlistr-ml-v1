'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('AvailableMarkets', {
			name: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			code: {
				type: Sequelize.STRING(2),
				primaryKey: true,
				allowNull: false,
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
		return queryInterface.dropTable('AvailableMarkets');
	}
};