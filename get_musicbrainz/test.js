// DEPENDENCIES
const chalk = require('chalk');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const PrettyError = require('pretty-error');
const pe = new PrettyError();

// MODULE DEPS
const models = require('../db/models');
const Artist = models.Artist;

// CONSTANTS
const { getRecordingsByArtistTrack, getRecordings, compileQuery } = require('./util');
const api_instance = require('../api_manager').musicbrainz;

// MAIN FUNCTION
const main = async () => {
	try {
//		const result = await api_instance.request(getTrackByIsrcConfig('GBAHT1600302'));
//		fs.writeFileSync('./results/musicbrainztest.json', JSON.stringify(result));
//		const release_result = await api_instance.request(getReleaseGroupByName('Tenance'));
//		fs.writeFileSync('./results/release-group-test.json', JSON.stringify(release_result));
// 		const artist_test = await api_instance.request(getRecordingsByArtistArr(['Lianne La Havas', 'Jeff Beck']));
//		fs.writeFileSync('./results/release-artist-test.json', JSON.stringify(artist_test));
/*		const artist_track_result = await api_instance.request(getRecordingsByArtistTrack([
			{
				artist_name: 'Lianne La Havas',
				track_name: 'Green \& Gold',
			}, {
				artist_name: 'Jeff Beck',
				track_name: 'People Get Ready',
			}
		], true));
		fs.writeFileSync('./results/artist-track-result.json', JSON.stringify(artist_track_result));*/
		const query_test = await api_instance.request(getRecordings(compileQuery([
			{
				artist: 'Lianne La Havas',
				recording: 'Green & Gold',
				release: 'Blood',
			}, /*{
				artist: 'Rihanna',
				recording: 'Bitch Better Have My Money',
				release: 'Bitch Better Have My Money',
			},*/
		])));
		fs.writeFileSync('./results/query-test.json', JSON.stringify(query_test));
	} catch (err) {
		console.error(pe.render(err));
	}
};

if (require.main === module) {
	main();
}

module.exports = main;
