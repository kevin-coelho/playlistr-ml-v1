'use strict';
module.exports = (sequelize, DataTypes) => {
  const Album = sequelize.define('Album', {
    album_type: DataTypes.TEXT,
    href: DataTypes.TEXT,
    id: DataTypes.TEXT,
    label: DataTypes.TEXT,
    name: DataTypes.TEXT,
    popularity: DataTypes.INTEGER,
    release_date: DataTypes.TEXT,
    release_date_precision: DataTypes.TEXT,
    type: DataTypes.TEXT,
    uri: DataTypes.TEXT
  }, {});
  Album.associate = function(models) {
    // associations can be defined here
    Album.hasMany(models.Artist, {
        // ??
    });
    Album.hasMany(models.AvailableMarket, {
        hooks: 'false',
    });
    //has many copyrights
    Album.hasMany(models.ExternalUrl, {
        onDelete: 'cascade',
        hooks: 'true',
    });
    Album.hasMany(models.Restriction, {
        onDelete: 'cascade',
        hooks: 'true',
    });
    Album.hasMany(models.ExternalId, {
        onDelete: 'cascade',
        hooks: 'true',
    });
    //has many genres
    Album.hasMany(models.Image, {
        // ?
    });
    //has one page (with multiple tracks)
  };
  return Album;
};
