const express = require('express');

const router = express.Router();

const git = require('../services/git');


router.get('/:teamId/repos', async (req, res) => {
  const { sort } = req.query;
  const withPull = req.query.withPull !== undefined;

  let repos = await git.getTeamRepos(req.user.token, req.params.teamId, sort);
  if (withPull) {
    repos = await git.getPullsForRepos(req.user.token, repos);
  }

  res.json(repos);
});

module.exports = router;
