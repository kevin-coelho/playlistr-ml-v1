'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('ExternalIds', {
			id: {
				allowNull: false,
				autoIncrement: false,
				primaryKey: true,
				type: Sequelize.TEXT
			},
			key: {
				allowNull: false,
				type: Sequelize.TEXT
			},
			value: {
				allowNull: false,
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
		}).then(() => queryInterface.addConstraint('ExternalIds', ['id', 'key', 'value'], {
			type: 'unique',
			name: 'external_id_unique',
		}));
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('ExternalIds');
	}
};