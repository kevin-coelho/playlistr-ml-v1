/*jshint esversion: 6, node: true*/
'use strict';

// DEPENDENCIES
const chalk = require('chalk');
const fs = require('fs');
const JSONStream = require('JSONStream');
const es = require('event-stream');
const PrettyError = require('pretty-error');
const pe = new PrettyError();

// CONSTANTS
const Promise = require('bluebird');

const main = async () => {
	const data_file = './results/toy_data_set_tracks_audio_analysis_temp.json';
	if (!fs.existsSync(data_file)) throw new Error(`[${data_file}] Data file not found.`);
	console.log(`[${chalk.yellow(data_file)}] Starting seed with audio analysis data file...`);

	let count = 0;

	/*
	return new Promise((resolve, reject) => {
		const chain = fs.createReadStream(data_file)
			.pipe(JSONStream.parse([{emitKey: true}]))
			.pipe(es.map((obj, cb) => {
				console.log(obj);
				count = count + 1;
			}));

		chain.on('end', () => {
			console.log('Done.');
			resolve();
		});
	});
	*/

	const playlists_json_file = './results/toy_data_set_playlists_full.json';
	return new Promise((resolve, reject) => {
		const pipeline = fs.createReadStream(playlists_json_file)
			.pipe(JSONStream.parse('.*.tracks.*.track.id'))
			.pipe(es.map((track, cb) => {
				console.log(track);
				cb(null, false);
			}));
		pipeline.on('error', err => console.log(pe.render(err)));
		pipeline.on('end', () => resolve());
	});
};

main();