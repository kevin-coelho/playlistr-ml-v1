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
			// ASSOCIATIONS
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
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('AudioAnalyses');
	}
};