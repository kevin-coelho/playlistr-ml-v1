const {
	create_user_playlists
} = require('../seeder-helpers');

module.exports = {
	up: (queryInterface, Sequelize) => create_user_playlists.up(queryInterface, Sequelize),
	down: (queryInterface, Sequelize) => create_user_playlists.down(queryInterface, Sequelize)
};