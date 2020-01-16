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

  if (req.url.startsWith('/oauth')) {
    next();
  } else if (req.url === '/') {
    if (cookie) {
      validateUser(req, cookie);
    }
    next();
  } else {
    if (cookie) {
      validateUser(req, cookie);
    }

    if (req.user) {
      next();
    } else {
      res.status(401).send();
    }
  }
};

module.exports = authMiddleware;
