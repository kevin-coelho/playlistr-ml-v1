'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Owners', {
			href: {
				type: Sequelize.TEXT
			},
			id: {
				type: Sequelize.TEXT,
				allowNull: false,
				autoIncrement: false,
				primaryKey: true,
			},
			type: {
				type: Sequelize.TEXT
			},
			uri: {
				type: Sequelize.TEXT
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
		return queryInterface.dropTable('Owners');
	}
};