'use strict';
module.exports = (sequelize, DataTypes) => {
	const AudioAnalysis = sequelize.define('AudioAnalysis', {
		bars: DataTypes.JSONB,
		beats: DataTypes.JSONB,
		meta: DataTypes.JSONB,
		sections: DataTypes.JSONB,
		segments: DataTypes.JSONB,
		tatums: DataTypes.JSONB,
		track: DataTypes.JSONB,
	}, {});
	AudioAnalysis.associate = function(models) {
		// associations can be defined here
	};
	return AudioAnalysis;
};