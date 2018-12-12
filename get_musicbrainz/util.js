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
		url: '/recording/',
		method: 'get',
		params: {
			query: `isrc:${isrc}`,
		}
	};
}

function getReleaseGroupByName(name) {
	return {
		url: '/release-group/',
		method: 'get',
		params: {
			query: `release:${name}`,
		},
	};
}

function getReleasesByArtistName(artist_name, fuzzy=false) {
	return {
		url: '/release/',
		method: 'get',
		params: {
			query: `artist:${artist_name}${fuzzy ? '~' : ''}`
		},
	};
}

function getReleasesByArtistArr(artists, fuzzy=false) {
	return {
		url: '/release/',
		method: 'get',
		params: {
			query: `artist:${artists.map(artist => `'${artist}'${fuzzy ? '~' : ''}`).join(' OR ')}`,
			limit: 100
		}
	};
}

function getRecordingsByArtistArr(artists, fuzzy=false) {
	return {
		url: '/recording/',
		method: 'get',
		params: {
			query: `artist:${artists.map(artist => `'${artist}'${fuzzy ? '~' : ''}`).join(' OR ')}`,
			limit: 100,
		}
	};
}

module.exports = {
	getTrackByIsrcConfig,
	getReleaseGroupByName,
	getReleasesByArtistName,
	getReleasesByArtistArr,
	getRecordingsByArtistArr,
};
