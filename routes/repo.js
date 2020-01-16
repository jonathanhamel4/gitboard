const express = require('express');

const router = express.Router();

const git = require('../services/git');

router.get('/user', async (req, res) => {
  const { sort } = req.query;
  const withPull = req.query.withPull !== undefined;

  let repos = await git.getUserRepositories(req.user.token, sort);
  if (withPull) {
    repos = await git.getPullsForRepos(req.user.token, repos);
  }

  res.json(repos);
});

router.get('/:owner/:repo/languages', async (req, res) => {
  const repos = await git.getRepoLanguages(req.user.token, req.params.owner, req.params.repo);
  res.json(repos);
});

router.get('/:owner/:repo/teams', async (req, res) => {
  const repos = await git.getRepoTeams(req.user.token, req.params.owner, req.params.repo);
  res.json(repos);
});

router.get('/:owner/:repo/pulls', async (req, res) => {
  const repos = await git.getRepoPulls(req.user.token, req.params.owner, req.params.repo);
  res.json(repos);
});

router.get('/:owner/:repo/commits', async (req, res) => {
  const repos = await git.getRepoCommits(req.user.token, req.params.owner, req.params.repo);
  res.json(repos);
});

router.get('/:owner/:repo/readme', async (req, res) => {
  const repos = await git.getRepoReadme(req.user.token, req.params.owner, req.params.repo);
  res.json(repos);
});


module.exports = router;
