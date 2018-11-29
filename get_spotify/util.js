// DEPENDENCIES
const qs = require('query-string');
const { sleep } = require('../utils');

// CONSTANTS
const user_playlist_limit = 50;
const track_limit = 50;
const page_request_delay = 10;

// FUNCTIONS

/**
 * Get a single playlist object from Spotify's API. Requires
 * the playlist to be publicly available.
 * 
 * @param  {int} 				id 	 ID of the playlist to retrieve
 * @return {Playlist Object} 		 Retrieved playlist object
 */
function getPlaylistConfig(id) {
	return {
		url: `/playlists/${id}`,
		method: 'get'
	};
}

/**
 * Get an array of track objects from Spotify's API.
 * 
 * @param  {[Array of String]} 						ids 	Array of track ids to retrieve. 
 * @return {[Array of Track Object]} 						Retrieved array of track objects
 */
function getTrackConfig(ids) {
	return {
		url: '/tracks',
		method: 'get',
		params: {
			ids: ids.join(','),
		},
	};
}

/**
 * Get the audio analysis for a track from Spotify's API
 * 
 * @param  {int}  						id 		ID of the track object
 * @return {Audio Analysis Object} 				Audio analysis object for the track
 */
function getTrackAudioAnalysisConfig(id) {
	return {
		url: `/audio-analysis/${id}`,
		method: 'get',
	};
}

/**
 * Get an array of audio features objects for the specified tracks from Spotify's API
 * 
 * @param  {[Array of strings]} 					ids		Ids of the tracks
 * @return {[Array of Audio Features Objects]}				Array of audio features objects in 
 *                    										the same order as the passed track ids
 */
function getTrackAudioFeaturesConfig(ids) {
	return {
		url: '/audio-features',
		method: 'get',
		params: {
			ids: ids.join(','),
		},
	};
}

/**
 * Get an array of Artist Objects for provided ids
 * 
 * @param  {String} 					ids 		Array of Ids of Artist to get from Spotify API
 * @return {[Array of Artist Object]} 				Array of Artist Objects, {"artists": [{firstArtist}, {secondArtist}, ...]}
 */
function getArtistConfig(ids) {
	return {
		url: '/artists',
		method: 'get',
		params: {
			ids: ids.join(','),
		}
	};
}

/**
 * Get an array of related artists for specified artist id
 * 
 * @param  {string} 					id 			id of the "seed" artist
 * @return {[Array of Artist Object]}    			Array of Artist Objects, {"artists": [{firstArtist}, {secondArtist}, ...]}
 */
function getRelatedArtistConfig(id) {
	return {
		url: `/artists/${id}/related-artists`,
		method: 'get',
	};
}

/**
 * @param  {Array} 				arr 		Array of items to batch
 * @param  {Int} 				batchSize	Size of batches to create
 * @return {Array of Array} 				Array of arrays, each of size <= batchSize
 */
function arrayToBatches(arr, batchSize) {
	const result = [];
	while (arr.length > 0) result.push(arr.splice(0, batchSize));
	return result;
}

/**
 * Get an array of items corresponding to a single Spotify paging object.
 * 
 * @param  {Spotify Axios API Instance}  	api_instance 	An instance of require('./api_manager')
 * @param  {Spotify Paging Object} 			firstPage    	The starting page
 * 
 * @return Promise => {[Array of Spotify Objects]}			Promise resolving to array of all objects extracted from the pages
 */
const pagingLoop = async (api_instance, firstPage) => {
	const results = firstPage.items;
	let current_page = firstPage;
	while (true) {
		if (!current_page.next) return Promise.resolve(results);
		try {
			const current_results = (await api_instance.request({
				url: current_page.next
			}));
			results.push(...current_results.items);
			current_page = current_results;
			await sleep(page_request_delay);
		} catch (err) {
			return Promise.reject(err);
		}
	}
};

module.exports = {
	getPlaylistConfig,
	getTrackConfig,
	pagingLoop,
	getTrackAudioAnalysisConfig,
	getTrackAudioFeaturesConfig,
	getArtistConfig,
	arrayToBatches,
	getRelatedArtistConfig,
};