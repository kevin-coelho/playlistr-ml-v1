'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Users', {
			id: {
				type: Sequelize.TEXT,
				allowNull: false,
				autoIncrement: false,
				primaryKey: true,
			},
			display_name: {
				type: Sequelize.TEXT,
			},
			href: {
				type: Sequelize.TEXT
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
		return queryInterface.dropTable('Users');
	}
};