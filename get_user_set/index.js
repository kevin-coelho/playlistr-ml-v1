// DEPENDENCIES
const chalk = require('chalk');
const PrettyError = require('pretty-error');
const pe = new PrettyError();
const path = require('path');
const Promise = require('bluebird');
const fs = require('fs');

// MODULE DEPENDENCIES
const {
	get_artists_by_track_by_playlist,
	get_audio_analysis_by_playlist_stream,
	get_audio_features_by_playlist,
	get_related_artists,
	get_playlists,
	recover_audio_analysis_errors,
} = require('../get_spotify');

const get_extended_related_artists = require('../db/seeder-helpers/get_extended_related_artists');

// CONSTANTS
const {
	user_id_file,
	user_playlists_full,
	user_playlists_audio_analysis,
	user_playlists_audio_features,
	audio_features_errors,
	audio_analysis_errors,
	user_playlists_artists,
	artists_errors,
	user_playlists_related_artists,
	results_dir,
	extended_related_artists,
} = require('./constants');

// SCRIPTS TO RUN
const scripts = [
	[get_playlists, [user_id_file, user_playlists_full]],
	[get_artists_by_track_by_playlist, [user_playlists_full, user_playlists_artists, artists_errors]],
	[get_related_artists, [user_playlists_artists, user_playlists_related_artists]],
	[get_audio_analysis_by_playlist_stream, [user_playlists_full, user_playlists_audio_analysis, audio_analysis_errors]],
	[get_audio_features_by_playlist, [user_playlists_full, user_playlists_audio_features, audio_features_errors]],
	[get_extended_related_artists, ['spotify_toy_data_set', 3, extended_related_artists]],
];

const recovery_scripts = [
	null, // todo
	null, // todo
	null, // todo
	[recover_audio_analysis_errors, [audio_analysis_errors, user_playlists_audio_analysis, audio_analysis_errors]],
	null, // todo
	null, // todo
];
// run in order
const main = async () => {	
	let err_flag = false;
	if (!fs.existsSync(path.resolve(results_dir))) {
		fs.mkdirSync(path.resolve(results_dir));
	}
	const args = process.argv.slice(2);
	try {
		if (args.length > 0) {
			const arg = args[0];
			let func;
			let func_args;
			if (arg == 'help' || (arg == 'recovery' && args.length < 2)) {
				console.log('[0] get_playlists');
				console.log('[1] get_artists');
				console.log('[2] get_related_artists');
				console.log('[3] get_audio_analyses');
				console.log('[4] get_audio_features');
				console.log('[5] get_extended_related_artists');
				process.exit(0);
			} else if (arg == 'recovery' && args.length > 1) {
				const idx = parseInt(args[1]);
				func = recovery_scripts[idx][0];
				func_args = recovery_scripts[idx][1];
			} else {
				const idx = parseInt(arg);
				func = scripts[idx][0];
				func_args = scripts[idx][1];
			}
			await func(...func_args);
		} else {
			console.log('Fetching entire user set. This may take some time...');
			await Promise.each(scripts, ([script, args]) => script(...args));
		}
	} catch (err) {
		console.error(pe.render(err));
		err_flag = true;
	}
	console.log(err_flag ? chalk.red('Completed with errors.') : `[${chalk.green(path.resolve(results_dir))}] Toy set JSON fetch complete.`);
	process.exit(0);
};

if (require.main === module) {
	main();
}

module.exports = main;
