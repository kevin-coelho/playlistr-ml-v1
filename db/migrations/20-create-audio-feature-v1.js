'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('AudioFeatures', {
			id: {
				allowNull: false,
				autoIncrement: false,
				primaryKey: true,
				type: Sequelize.TEXT
			},
			// ASSOCIATIONS
			trackId: {
				allowNull: false,
				type: Sequelize.TEXT,
				references: {
					model: 'Tracks',
					key: 'id',
				},
				onUpdate: 'cascade',
				onDelete: 'cascade',
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			danceability: {
				type: Sequelize.DECIMAL(24, 12),
			},
			energy: {
				type: Sequelize.DECIMAL(24, 12),
			},
			key: {
				type: Sequelize.INTEGER,
			},
			loudness: {
				type: Sequelize.DECIMAL(24, 12),
			},
			mode: {
				type: Sequelize.INTEGER,
			},
			speechiness: {
				type: Sequelize.DECIMAL(24, 12),
			},
			acousticness: {
				type: Sequelize.DECIMAL(24, 12),
			},
			instrumentalness: {
				type: Sequelize.DECIMAL(24, 12),
			},
			liveness: {
				type: Sequelize.DataTypes.DECIMAL(24, 12),
			},
			valence: {
				type: Sequelize.DataTypes.DECIMAL(24, 12),
			},
			tempo: {
				type: Sequelize.DataTypes.DECIMAL(24, 12),
			},
			type: {
				type: Sequelize.TEXT,
			},
			uri: {
				type: Sequelize.TEXT,
			},
			track_href: {
				type: Sequelize.TEXT,
			},
			analysis_url: {
				type: Sequelize.TEXT,
			},
			duration_ms: {
				type: Sequelize.INTEGER,
			},
			time_signature: {
				type: Sequelize.INTEGER,
			},
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('AudioFeatures');
	}
};