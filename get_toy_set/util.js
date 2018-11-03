function getPlaylistConfig(id) {
	return {
		url: `https://api.spotify.com/v1/playlists/${id}`,
		method: 'get'
	}
}
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = { getPlaylistConfig, sleep };