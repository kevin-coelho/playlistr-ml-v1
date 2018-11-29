const {
	getTrackConfig
} = require('../get_spotify/util');

const main = async () => {
	try {
		const api_instance = await require('./spotify');
		const result = await api_instance.request(getTrackConfig(['6hgFjy9QqRMycNFa2tS85k']));
		console.log(result);
		return Promise.resolve();
	} catch (err) {
//		console.error(err);
		return Promise.resolve();
	}
};


if (require.main === module) {
	main();
}

module.exports = main;