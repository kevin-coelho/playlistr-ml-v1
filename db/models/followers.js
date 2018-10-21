'use strict';
module.exports = (sequelize, DataTypes) => {
	const Followers = sequelize.define('Followers', {
		href: DataTypes.TEXT,
		total: DataTypes.INTEGER
	}, {
		freezeTableName: true,
	});
	Followers.associate = function(models) {
		// associations can be defined here
	};
	return Followers;
};