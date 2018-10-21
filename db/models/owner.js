'use strict';
module.exports = (sequelize, DataTypes) => {
  const Owner = sequelize.define('Owner', {
    href: DataTypes.TEXT,
    id: DataTypes.TEXT,
    type: DataTypes.TEXT,
    uri: DataTypes.TEXT
  }, {});
  Owner.associate = function(models) {
    // associations can be defined here
    Owner.hasOne(models.ExternalUrl, {
		onDelete: 'cascade',
		hooks: 'true',
    });
  };
  return Owner;
};