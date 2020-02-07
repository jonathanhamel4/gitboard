const urls = {
  oauth: {
    install: '/oauth/install',
    verify: '/oauth/verify'
  },
  orgs: {
    repos: (org) => `/orgs/${org}/repos?sort=full_name&withPull`
  },
  teams: {
    repos: (team) => `/teams/${team}/repos?sort=full_name&withPull`
  },
  user: {
    repos: '/repos/user?sort=full_name&withPull'
  }
};


export default urls;
