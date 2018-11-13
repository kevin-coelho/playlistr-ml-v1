'use strict';
module.exports = (sequelize, DataTypes) => {
	const AudioFeature = sequelize.define('AudioFeature', {
		danceability: DataTypes.DECIMAL(10, 12),
		energy: DataTypes.DECIMAL(10, 12),
		key: DataTypes.INTEGER,
		loudness: DataTypes.DECIMAL(10, 12),
		mode: DataTypes.INTEGER,
		speechiness: DataTypes.DECIMAL(10, 12),
		acousticness: DataTypes.DECIMAL(10, 12),
		instrumentalness: DataTypes.DECIMAL(10, 12),
		liveness: DataTypes.DECIMAL(10, 12),
		valence: DataTypes.DECIMAL(10, 12),
		tempo: DataTypes.DECIMAL(10, 12),
		type: DataTypes.TEXT,
		uri: DataTypes.TEXT,
		track_href: DataTypes.TEXT,
		analysis_url: DataTypes.TEXT,
		duration_ms: DataTypes.INTEGER,
		time_signature: DataTypes.INTEGER,
	}, {});
	AudioFeature.associate = function(models) {
		AudioFeature.belongsTo(models.Track, {
			onDelete: 'cascade',
			hooks: 'true',
		});
	};
	return AudioFeature;
};