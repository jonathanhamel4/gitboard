const fetch = require('node-fetch');
const crypto = require('crypto');

const fs = require('fs');
const git = require('./git');

const { env } = require('../environment');

const setUserToken = (hash, userData) => {
  let usersAuth = {};
  if (fs.existsSync(env.USERS_DIR)) {
    const jsonFile = fs.readFileSync(env.USERS_DIR);
    usersAuth = JSON.parse(jsonFile);
  }
  usersAuth[hash] = userData;
  fs.writeFileSync(env.USERS_DIR, JSON.stringify(usersAuth, null, 4));
};

const unsetUserToken = (hash) => {
  const jsonFile = fs.readFileSync(env.USERS_DIR);
  const usersAuth = JSON.parse(jsonFile);
  delete usersAuth[hash];
  fs.writeFileSync(env.USERS_DIR, JSON.stringify(usersAuth, null, 4));
};


async function getAccessToken(code) {
  const response = await fetch(`${env.GITHUB_OAUTH_URL}/access_token`, {
    method: 'POST',
    body: JSON.stringify({
      client_id: env.CLIENT_ID,
      client_secret: env.CLIENT_SECRET,
      code,
      state: env.STATE,
    }),
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  });

  const body = await response.json();
  const token = body.access_token;
  const authUser = await git.getAuthUser(token);
  const hash = crypto.createHash('sha256').update(`${authUser.id},${authUser.node_id}`).digest('hex');
  authUser.token = token;
  setUserToken(hash, authUser);
  return [hash, authUser];
}

function logoutUser(hash) {
  unsetUserToken(hash);
}


module.exports = { getAccessToken, logoutUser };
