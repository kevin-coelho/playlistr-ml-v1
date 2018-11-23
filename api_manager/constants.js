const path = require('path');
const root_dir = path.resolve(__dirname, '..');
const token_dir = path.resolve(root_dir, 'api_manager/env');

module.exports = { root_dir, token_dir };