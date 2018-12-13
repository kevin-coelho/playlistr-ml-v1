'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('artist_album', {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			artistId: {
				type: Sequelize.TEXT,
				allowNull: false,
				references: {
					model: 'Artists',
					key: 'id',
				}
			},
			albumId: {
				type: Sequelize.TEXT,
				allowNull: false,
				references: {
					model: 'Albums',
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
		}).then(() => queryInterface.addConstraint('artist_album', ['artistId', 'albumId'], {
			type: 'unique',
			name: 'artist_album_unique',
		}));
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('artist_album');
	}
};
