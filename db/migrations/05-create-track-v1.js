'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Tracks', {
			// PRIMITIVE TYPES
			id: {
				allowNull: false,
				autoIncrement: false,
				primaryKey: true,
				type: Sequelize.TEXT
			},
			href: {
				type: Sequelize.TEXT
			},
			is_playable: {
				type: Sequelize.BOOLEAN
			},
			name: {
				type: Sequelize.TEXT
			},
			disc_number: {
				type: Sequelize.INTEGER,
			},
			duration_ms: {
				type: Sequelize.INTEGER,
			},
			explicit: {
				type: Sequelize.BOOLEAN,
			},
			popularity: {
				type: Sequelize.INTEGER,
			},
			preview_url: {
				type: Sequelize.TEXT
			},
			track_number: {
				type: Sequelize.INTEGER
			},
			type: {
				type: Sequelize.TEXT,
			},
			uri: {
				type: Sequelize.TEXT,
			},
			is_local: {
				type: Sequelize.BOOLEAN,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			// ASSOCIATIONS
			album: {
				type: Sequelize.TEXT,
				references: {
					model: 'Albums',
					key: 'id',
				},
			},
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('Tracks');
	}
};