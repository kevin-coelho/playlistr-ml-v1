'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Artists', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.TEXT
			},
			href: {
				type: Sequelize.TEXT
			},
			name: {
				type: Sequelize.TEXT
			},
			popularity: {
				type: Sequelize.INTEGER				
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
		return queryInterface.dropTable('Artists');
	}
};