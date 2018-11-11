'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Playlists', {
			id: {
				allowNull: false,
				autoIncrement: false,
				primaryKey: true,
				type: Sequelize.STRING
			},
			collaborative: {
				type: Sequelize.BOOLEAN,
			},
			description: {
				type: Sequelize.TEXT
			},
			href: {
				type: Sequelize.TEXT
			},
			name: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			primary_color: {
				type: Sequelize.TEXT,
			},
			public: {
				type: Sequelize.BOOLEAN,
			},
			snapshot_id: {
				type: Sequelize.TEXT
			},
			type: {
				type: Sequelize.TEXT
			},
			uri: {
				type: Sequelize.TEXT,
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
		return queryInterface.dropTable('Playlists');
	}
};