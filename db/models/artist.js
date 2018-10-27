'use strict';
module.exports = (sequelize, DataTypes) => {
  const Artist = sequelize.define('Artist', {
    href: DataTypes.TEXT,
    id: DataTypes.TEXT,
    name: DataTypes.TEXT,
    popularity: DataTypes.INT,
    type: DataTypes.TEXT,
    uri: DataTypes.TEXT
  }, {});
  Artist.associate = function(models) {
    // associations can be defined here
    Artist.hasMany(models.ExternalUrl, {
        onDelete: 'cascade',
        hooks: 'true',
    });
    Artist.hasOne(models.Followers, {
        onDelete: 'cascade',
        hooks: 'true',
    });
    //has many genres
    Artist.hasMany(models.Image, {
        // ?
    });
  };
  return Artist;
};
