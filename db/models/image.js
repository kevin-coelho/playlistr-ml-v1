'use strict';
module.exports = (sequelize, DataTypes) => {
	const Image = sequelize.define('Image', {
		url: DataTypes.TEXT,
		height: DataTypes.INTEGER,
		width: DataTypes.INTEGER,
	}, {});
	Image.associate = function(models) {
		// associations can be defined here
	};
	return Image;
};