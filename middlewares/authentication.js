const fs = require('fs');

const { env } = require('../environment');

const validateUser = (req, cookie) => {
  if (!cookie || !req) return;

  const jsonFile = fs.readFileSync(env.USERS_DIR);
  const usersAuth = JSON.parse(jsonFile);

  req.user = usersAuth[cookie];
};


const authMiddleware = (req, res, next) => {
  const cookie = req.cookies.authUser;
  validateUser(req, cookie);
  if (req.url.startsWith('/oauth')) {
    next();
    return;
  }

  if (req.xhr && !req.user) {
    res.status(401).send();
    return;
  }

  next();
};

module.exports = authMiddleware;
