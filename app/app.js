var express = require('express'),
    session = require('express-session'),
    path = require('path'),
    helmet = require('helmet'),
    bodyParser = require('body-parser'),
    compression = require('compression'),
    favicon = require('serve-favicon');

app = express();
app.use(compression())
app.use(helmet());              // TODO CSP
app.use(helmet.expectCt({       // check out secrityheaders.io
  enforce: true,
  maxAge: 10
}))
app.use(helmet.noCache());
app.use(helmet.referrerPolicy({policy: 'origin'})); // => same-origin; when chrome allows it
// app.use(helmet.hpkp({
//     maxAge: 7776000,            // 90 days
//     sha256s: [process.env.HPKP_SHA01,
//               process.env.HPKP_SHA02]}));
app.disable('x-powered-by');
if (process.env.PRODUCTION) {
    app.set('trust proxy', 1);
    sess.cookie.secure = true;
}

app.use(favicon(__dirname + '/public/favicon/er.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// todo: express validator of input ... added security?
// todo: content security policy? helmet
// todo: put users of ./routes/login.js in directory

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// routes
var routes = require('./routes/index'),
    database = require('./routes/database');


app.use('/', routes);
app.use('/database', database);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (process.env.DEVELOPMENT) {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
