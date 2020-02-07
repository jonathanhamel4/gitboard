const express = require('express');
const oauth = require('../services/oauth');

const router = express.Router();

const { env } = require('../environment');

router.post('/install', (req, res) => {
  if (req.xhr) res.status(400).send();
  else {
    res.redirect(`${env.GITHUB_OAUTH_URL}/authorize`
      + `?client_id=${env.CLIENT_ID}&client_secret=${env.CLIENT_SECRET}&scope=read:user,read:org,repo&state=${env.STATE}&allow_signup=false`);
  }
});

router.get('/code', async (req, res) => {
  const { code } = req.query;
  const { state } = req.query;
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  if (!code || state !== env.STATE) res.status(400).send();
  else {
    try {
      const [hash] = await oauth.getAccessToken(code);
      res.cookie('authUser', hash, { expires: 0, path: '/' });
      res.redirect(baseUrl);
    } catch (err) {
      console.log('Error fetching the oauth token', err);
      res.status(500).send();
    }
  }
});


router.post('/logout', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  if (req.cookies.authUser) {
    oauth.logoutUser(req.cookies.authUser);
  }
  res.cookie('authUser', '', { expires: new Date(0) });
  res.redirect(baseUrl);
});

router.get('/verify', (req, res) => {
  const isAuth = !!(req.user && req.user.token);
  res.json({ isAuth });
});


module.exports = router;
