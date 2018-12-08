// DEPENDENCIES
const qs = require('query-string');
const { sleep } = require('../utils');

// CONSTANTS
const user_playlist_limit = 50;
const track_limit = 50;
const page_request_delay = 10;

// FUNCTIONS
function getTrackByIsrcConfig(isrc) {
	return {
		url: '/recording',
		method: 'get',
		params: {
			isrc
		}
	};
}

module.exports = {
	getTrackByIsrcConfig,
};