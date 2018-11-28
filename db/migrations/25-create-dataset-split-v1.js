'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('DataSetSplits', {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			splitId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				autoIncrement: false,
			},
			trackId: {
				type: Sequelize.TEXT,
				allowNull: false,
				references: {
					model: 'Tracks',
					key: 'id',
				}
			},
			dataSet: {
				type: Sequelize.TEXT,
				allowNull: false,
				references: {
					model: 'DataSets',
					key: 'name',
				},
			},
			label: {
				type: Sequelize.TEXT,
				allowNull: false,				
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		}).then(() => queryInterface.addConstraint('DataSetSplits', ['label'], {
			type: 'check',
			where: {
				'label': ['train', 'eval', 'test'],
			},
		})).then(() => queryInterface.addConstraint('DataSetSplits', ['splitId', 'trackId', 'dataSet'], {
			type: 'unique',
			name: 'dataset_split_tracks_unique',
		})).then(() => queryInterface.addConstraint('DataSetSplits', ['splitId', 'trackId', 'dataSet', 'label'], {
			type: 'unique',
			name: 'dataset_split_track_label_unique',
		}));
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('DataSetSplits');
	}
};