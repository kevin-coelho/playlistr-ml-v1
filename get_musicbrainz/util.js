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

function compileQuery(query_arr, fuzzy=false) {
	fuzzy = fuzzy ? '~' : '';
	return query_arr.map(query_obj => {
		const terms = Object.keys(query_obj).map(key => `${key}:"${query_obj[key]}"${fuzzy}`).join(' AND ');
		return `(${terms})`;
	}).join(' OR ');
}

function getRecordings(query) {
	return {
		url: '/recording/',
		method: 'get',
		params: {
			query,
			limit: 100,
		},
	};
}

function getRecordingsByArtistTrack(artist_track_arr, fuzzy=false) {
	fuzzy = fuzzy ? '~' : '';
	const query = artist_track_arr.map(({ artist_name, track_name }) => `(artist:"${artist_name}"${fuzzy} AND recording:"${track_name}"${fuzzy})`).join(' OR ');
	return {
		url: '/recording/',
		method: 'get',
		params: {
			query,
			limit: artist_track_arr.length < 100 ? 100 : artist_track_arr.length,
		},
	};
}

module.exports = {
	getTrackByIsrcConfig,
	getReleaseGroupByName,
	getReleasesByArtistName,
	getReleasesByArtistArr,
	getRecordingsByArtistArr,
	getRecordingsByArtistTrack,
	getRecordings,
	compileQuery
};
