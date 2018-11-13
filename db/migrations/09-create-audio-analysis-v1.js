'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('AudioAnalyses', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			trackId: {
				allowNull: false,
				type: Sequelize.TEXT,
				references: {
					model: 'Tracks',
					key: 'id'
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
			duration: {
				type: Sequelize.DECIMAL(24, 12),
			},
			loudness: {
				type: Sequelize.DECIMAL(24, 12),
			},
			tempo: {
				type: Sequelize.DECIMAL(24, 12),
			},
			tempo_confidence: {
				type: Sequelize.DECIMAL(24, 12),
			},
			time_signature: {
				type: Sequelize.INTEGER,
			},
			time_signature_confidence: {
				type: Sequelize.DECIMAL(24, 12),
			},
			key: {
				type: Sequelize.INTEGER,
			},
			key_confidence: {
				type: Sequelize.DECIMAL(24, 12),
			},
			mode: {
				type: Sequelize.INTEGER,
			},
			mode_confidence: {
				type: Sequelize.DECIMAL(24, 12),
			},
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('AudioAnalyses');
	}
};