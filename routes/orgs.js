const express = require('express');

const router = express.Router();

const git = require('../services/git');

router.get('/', async (req, res) => {
  const organizations = await git.getOrganizations(req.user.token);
  res.json(organizations);
});

router.get('/:id/repos', async (req, res) => {
  const { sort } = req.query;
  const withPull = req.query.withPull !== undefined;

  let repos = await git.getOrganizationRepos(req.user.token, req.params.id, sort);
  if (withPull) {
    repos = await git.getPullsForRepos(req.user.token, repos);
  }

  res.json(repos);
});


router.get('/:id/teams', async (req, res) => {
  const repos = await git.getOrgTeams(req.user.token, req.params.id);
  res.json(repos);
});

module.exports = router;
