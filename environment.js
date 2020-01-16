const path = require('path');

require('dotenv').config();

const env = {
  CLIENT_ID: process.env.CLIENT_ID || '',
  CLIENT_SECRET: process.env.CLIENT_SECRET || '',
  GITHUB_OAUTH_URL: process.env.GITHUB_OAUTH_URL || '',
  GITHUB_API_URL: process.env.GITHUB_API_URL || '',
  PORT: process.env.PORT || '3000',
  STATE: process.env.STATE || '',
  USERS_DIR: path.join(__dirname, 'users.json'),
};

const validate = () => {
  if (!env.CLIENT_ID) throw new Error('CLIENT_ID is not defined or invalid');
  if (!env.CLIENT_SECRET) throw new Error('CLIENT_SECRET is not defined or invalid');
  if (!env.GITHUB_OAUTH_URL) throw new Error('GITHUB_OAUTH_URL is not defined or invalid');
  if (!env.GITHUB_API_URL) throw new Error('GITHUB_API_URL is not defined or invalid');
  if (!env.STATE) throw new Error('STATE is not defined or invalid');
};

module.exports = { env, validate };
