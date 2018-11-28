function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function filterUnique(arr, key) {
	return arr.filter((track, idx, self) => self.findIndex(elem => elem[key] === track[key]) === idx);
}

function now(unit) {
	const hrTime = process.hrtime();

	switch (unit) {
	case 'milli':
		return hrTime[0] * 1000 + hrTime[1] / 1000000;

	case 'micro':
		return hrTime[0] * 1000000 + hrTime[1] / 1000;

	case 'nano':
		return hrTime[0] * 1000000000 + hrTime[1];

	default:
		return hrTime[0] * 1000000000 + hrTime[1];
	}
}

module.exports = { sleep, filterUnique, now };