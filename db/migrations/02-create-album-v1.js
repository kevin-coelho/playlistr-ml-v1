'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Albums', {
			id: {
				allowNull: false,
				autoIncrement: false,
				primaryKey: true,
				type: Sequelize.TEXT,
			},
			name: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			href: {
				type: Sequelize.TEXT,
			},
			album_type: {
				type: Sequelize.TEXT,
			},
			release_date: {
				type: Sequelize.TEXT,
			},
			release_date_precision: {
				type: Sequelize.TEXT
			},
			total_tracks: {
				type: Sequelize.INTEGER
			},
			type: {
				type: Sequelize.TEXT,
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
		return queryInterface.dropTable('Albums');
	}
};
