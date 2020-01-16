const fetch = require('node-fetch');
const parseLinkHeader = require('parse-link-header');

const { env } = require('../environment');


const getHeaders = (token) => ({
  Accept: 'application/vnd.github.v3+json',
  Authorization: `token ${token}`,
  'Content-Type': 'application/json',
});

const getAllResults = async (response, options, accumulator) => {
  const linkHeader = response.headers.get('link');
  const parsedLink = parseLinkHeader(linkHeader);

  if (parsedLink && parsedLink.next) {
    const results = await fetch(parsedLink.next.url, options);
    accumulator.push(...await results.json());
    await getAllResults(results, options, accumulator);
  }
};


/** Exported members * */
const getOrganizations = async (token) => {
  const options = {
    headers: getHeaders(token),
  };
  const result = await fetch(`${env.GITHUB_API_URL}/user/orgs`, options);
  const orgs = await result.json();
  await getAllResults(result, options, orgs);
  return orgs;
};


const getOrganizationRepos = async (token, organization, sort) => {
  const sortOption = (sort && ['created', 'updated', 'pushed', 'full_name'].includes(sort)) ? sort : 'full_name';

  const options = {
    headers: getHeaders(token),
  };
  const result = await fetch(`${env.GITHUB_API_URL}/orgs/${organization}/repos?per_page=100&sort=${sortOption}`, options);
  const repos = await result.json();
  await getAllResults(result, options, repos);
  return repos;
};


const getUserRepositories = async (token, sort) => {
  const sortOption = (sort && ['created', 'updated', 'pushed', 'full_name'].includes(sort)) ? sort : 'full_name';

  const options = {
    headers: getHeaders(token),
  };
  const result = await fetch(`${env.GITHUB_API_URL}/user/repos?per_page=100&sort=${sortOption}`, options);
  const repos = await result.json();
  await getAllResults(result, options, repos);

  return repos;
};

const getRepoLanguages = async (token, owner, repo) => {
  const options = {
    headers: getHeaders(token),
  };
  const result = await fetch(`${env.GITHUB_API_URL}/repos/${owner}/${repo}/languages`, options);
  const repos = await result.json();
  await getAllResults(result, options, repos);
  return repos;
};

const getRepoTeams = async (token, owner, repo) => {
  const options = {
    headers: getHeaders(token),
  };
  const result = await fetch(`${env.GITHUB_API_URL}/repos/${owner}/${repo}/teams`, options);
  const repos = await result.json();
  await getAllResults(result, options, repos);
  return repos;
};


const getRepoPulls = async (token, owner, repo) => {
  const options = {
    headers: getHeaders(token),
  };
  const result = await fetch(`${env.GITHUB_API_URL}/repos/${owner}/${repo}/pulls`, options);
  const pulls = await result.json();
  await getAllResults(result, options, pulls);
  return pulls;
};


const getRepoCommits = async (token, owner, repo) => {
  const options = {
    headers: getHeaders(token),
  };
  const result = await fetch(`${env.GITHUB_API_URL}/repos/${owner}/${repo}/stats/commit_activity`, options);
  return await result.json();
};


const getRepoReadme = async (token, owner, repo) => {
  const options = {
    headers: getHeaders(token),
  };
  const result = await fetch(`${env.GITHUB_API_URL}/repos/${owner}/${repo}/readme`, options);
  return await result.json();
};

const getOrgTeams = async (token, org) => {
  const options = {
    headers: getHeaders(token),
  };
  const result = await fetch(`${env.GITHUB_API_URL}/orgs/${org}/teams`, options);
  return await result.json();
};

const getTeamRepos = async (token, teamId, sort) => {
  const sortOption = (sort && ['created', 'updated', 'pushed', 'full_name'].includes(sort)) ? sort : 'full_name';
  const options = {
    headers: getHeaders(token),
  };
  const result = await fetch(`${env.GITHUB_API_URL}/teams/${teamId}/repos?per_page=100&sort=${sortOption}`, options);
  const repos = await result.json();
  await getAllResults(result, options, repos);
  return repos;
};


const getPullsForRepos = async (token, repos) => await Promise.all(repos.map(async (repo) => {
  const repoClone = JSON.parse(JSON.stringify(repo));
  const pulls = await getRepoPulls(token, repo.owner.login, repo.name);
  repoClone.pulls = pulls;
  return repoClone;
}));


// Only function that requires the user token (Used for the initial login)
const getAuthUser = async (token) => {
  const options = {
    headers: getHeaders(token),
  };
  const result = await fetch(`${env.GITHUB_API_URL}/user`, options);
  const userInfo = await result.json();
  return userInfo;
};


module.exports = {
  getOrganizations,
  getOrganizationRepos,
  getUserRepositories,
  getRepoLanguages,
  getRepoTeams,
  getRepoPulls,
  getRepoCommits,
  getRepoReadme,
  getOrgTeams,
  getTeamRepos,
  getPullsForRepos,
  getAuthUser,
};
