'use strict';
module.exports = (sequelize, DataTypes) => {
	const AvailableMarket = sequelize.define('AvailableMarket', {
		name: DataTypes.TEXT,
		code: DataTypes.STRING(2),
	}, {});
	AvailableMarket.associate = function(models) {
		// associations can be defined here
	};
	return AvailableMarket;
};
/* amel testing */
