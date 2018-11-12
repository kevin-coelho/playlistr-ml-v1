function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function filterUnique(arr, key) {
	return arr.filter((track, idx, self) => self.findIndex(elem => elem[key] === track[key]) === idx);
}

module.exports = { sleep, filterUnique };