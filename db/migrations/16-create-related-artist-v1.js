'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('related_artist', {
			id: {				
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			primaryArtist: {
				type: Sequelize.TEXT,				
				allowNull: false,
				references: {
					model: 'Artists',
					key: 'id',
				},
			},
			secondaryArtist: {
				type: Sequelize.TEXT,
				allowNull: false,
				references: {
					model: 'Artists',
					key: 'id',
				},
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		}).then(() => queryInterface.addConstraint('related_artist', ['primaryArtist', 'secondaryArtist'], {
			type: 'unique',
			name: 'primary_secondary_unique_constraint',
		}));
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('related_artist');
	}
};