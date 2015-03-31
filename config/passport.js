var LocalStrategy = require('passport-local').Strategy;
var User       = require('../models/user');
module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user.username);
    });

    passport.deserializeUser(function (username, done) {
        User.findOne({username:username}, function(err, user) {
         done(err, user);
        });
    });

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with username
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, username, password, done) {
            console.log("username: " + username);
            console.log("password: " + password);
            console.log("req: " + req);
            console.log("login 1");
            //username is username
            // asynchronous
            process.nextTick(function () {
                User.findOne({ 'username' :  username }, function(err, user) {
                    console.log("login 2");
                    if (err)
                        return done(err);
                    console.log("login 3");
                    if (!user) {
                        console.log("login 5");
                        return done(null, false, req.flash('loginMessage', 'No user found.'));
                    }
                    console.log("login 4");
                    if (!user.validPassword(password)) {
                        console.log("login 7");
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                    }
                    else {
                        console.log("HERE 8");
                        return done(null, user);
                    }
                });
            });

        }));

};