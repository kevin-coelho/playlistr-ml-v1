const moment = require('moment');

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}