var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var mongoose = require('mongoose');
var ds = require('DatabaseStuff');
ds.init(mongoose);

var app = express();

// view engine setup
app.engine('.hbs', exphbs({defaultLayout: 'basic', extname: '.hbs'}));
app.set('view engine', '.hbs');

require('./config/passport')(passport, ds);

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// required for passport
app.use(session({
    secret: 'nPtlGfnUhFctNuwGOCyGAcjztimSAG',
    cookie: {maxAge: 2628000000},
    saveUninitialized: true,
    resave: true
}));

app.use(function (req, res, next) {
    res.locals.user = req.user; // This is the important line
    next();
});
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes
var router = express.Router();
require('./config/routes')(router, passport, ds); // load our routes and pass in our app and fully configured passport
app.use('/', router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler, will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler, no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
