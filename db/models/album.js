'use strict';
module.exports = (sequelize, DataTypes) => {
  const Album = sequelize.define('Album', {
    name: DataTypes.TEXT
  }, {});
  Album.associate = function(models) {
    // associations can be defined here
  };
  return Album;
};