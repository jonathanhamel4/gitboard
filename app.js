const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const authMiddleware = require('./middlewares/authentication');

const indexRouter = require('./routes');
const oauthRouter = require('./routes/oauth');
const orgsRouter = require('./routes/orgs');
const teamsRouter = require('./routes/teams');
const repoRouter = require('./routes/repo');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(authMiddleware);

app.use('/', indexRouter);
app.use('/oauth', oauthRouter);
app.use('/orgs', orgsRouter);
app.use('/teams', teamsRouter);
app.use('/repos', repoRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

module.exports = app;
