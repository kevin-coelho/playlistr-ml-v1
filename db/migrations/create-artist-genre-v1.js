'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('artist_genre', {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			genre: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'Genres',
					key: 'id',
				}
			},
			artistId: {
				type: Sequelize.TEXT,
				allowNull: false,
				references: {
					model: 'Artists',
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
		return queryInterface.dropTable('artist_genre');
	}
};