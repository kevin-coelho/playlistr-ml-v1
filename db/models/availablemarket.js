'use strict';
module.exports = (sequelize, DataTypes) => {
	const AvailableMarket = sequelize.define('AvailableMarket', {
		name: DataTypes.TEXT,
		code: {
			type: DataTypes.STRING(2),
			validate: {
				len: 2,
			},
		},
	}, {});
	AvailableMarket.associate = function(models) {
		// associations can be defined here
		AvailableMarket.belongsToMany(models.Track, {
			as: 'market',
			through: 'track_market',
		});
	};
	return AvailableMarket;
};