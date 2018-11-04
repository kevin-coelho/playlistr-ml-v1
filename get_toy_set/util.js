// DEPENDENCIES
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
	}
}

/**
 * Get an array of track objects from Spotify's API.
 * 
 * @param  {int} 							 ids 	Array of track ids to retrieve
 * @return {[Array of Track Object]} 				Retrieved array of track objects
 */
function getTrackConfig(ids) {
	return {
		url: `/tracks`,
		method: 'get',
		params: {
			ids
		},
	}
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
	}
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
			})).data;
			results.push(...current_results.items);
			current_page = current_results;
			await sleep(page_request_delay);
		} catch (err) {
			return Promise.reject(err);
		}
	}
}

module.exports = { getPlaylistConfig, getTrackConfig, pagingLoop, getTrackAudioAnalysisConfig };