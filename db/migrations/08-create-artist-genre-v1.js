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
				type: Sequelize.TEXT,
				allowNull: false,
				references: {
					model: 'Genres',
					key: 'name',
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
		}).then(() => queryInterface.addConstraint('artist_genre', ['genre', 'artistId'], {
			type: 'unique',
			name: 'artist_genre_unique',
		}));
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('artist_genre');
	}
};