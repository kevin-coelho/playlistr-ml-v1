'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('AudioAnalyses', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			bars: {
				type: Sequelize.JSONB
			},
			beats: {
				type: Sequelize.JSONB
			},
			meta: {
				type: Sequelize.JSONB
			},
			sections: {
				type: Sequelize.JSONB
			},
			segments: {
				type: Sequelize.JSONB
			},
			tatums: {
				type: Sequelize.JSONB
			},
			track: {
				type: Sequelize.JSONB
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			// ASSOCIATIONS
			trackId: {
				type: Sequelize.TEXT,
				references: {
					model: 'Tracks',
					key: 'id'
				},
				onUpdate: 'cascade',
				onDelete: 'cascade',
			},
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('AudioAnalyses');
	}
};