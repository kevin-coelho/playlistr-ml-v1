'use strict';
module.exports = (sequelize, DataTypes) => {
	const AudioAnalysis = sequelize.define('AudioAnalysis', {
		trackId: {
			type: DataTypes.TEXT,
			references: {
				model: 'Track',
				key: 'id',
			},
		},
		duration: DataTypes.DECIMAL(24, 12),
		loudness: DataTypes.DECIMAL(24, 12),
		tempo: DataTypes.DECIMAL(24, 12),
		tempo_confidence: DataTypes.DECIMAL(24, 12),
		time_signature: DataTypes.INTEGER,
		time_signature_confidence: DataTypes.DECIMAL(24, 12),
		key: DataTypes.INTEGER,
		key_confidence: DataTypes.DECIMAL(24, 12),
		mode: DataTypes.INTEGER,
		mode_confidence: DataTypes.DECIMAL(24, 12),
	}, {});
	AudioAnalysis.associate = function(models) {
		// associations can be defined here
		AudioAnalysis.belongsTo(models.Track, {
			onDelete: 'cascade',
			hooks: 'true',
		});
	};
	return AudioAnalysis;
};