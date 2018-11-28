// DEPENDENCIES
const fs = require('fs');
const chalk = require('chalk');
const { exec } = require('child_process');

// CONSTANTS
const config_file = './config.json';
const temp_file = './sql_temp.sql';

const main = async () => {
	if (!fs.existsSync(config_file)) {
		console.error(`[${chalk.red(config_file)}] DB setup error. Config file does not exist.`);
		process.exit(1);
	}
	const config = JSON.parse(fs.readFileSync(config_file));
	const { username, password } = config[process.env.NODE_ENV !== 'PRODUCTION' ? 'development': 'production'];
	const sql = `
		DROP ROLE IF EXISTS ${username};
		CREATE ROLE ${username};
		ALTER ROLE ${username} WITH LOGIN PASSWORD '${password}' CREATEDB;
	`;
	fs.writeFileSync(temp_file, sql);
	const cmd = `psql -U $(whoami) -d postgres -f ${temp_file}`;
	exec(cmd, (err, stdout, stderr) => {
		if (err) console.error(err);
		if (stderr) console.error(chalk.red(stderr));
		if (stdout) console.log(stdout);
		fs.unlinkSync(temp_file);
	});
};

main();