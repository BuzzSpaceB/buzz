
module.exports = function (passport, ds) {

    var LocalStrategy = require('passport-local').Strategy;
    var User       = ds.models.user;

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
                    if (err)
                        return done(err);
                    if (!user) {
                        return done(null, false, req.flash('loginMessage', 'No user found.'));
                    }
                    if (!user.validPassword(password)) {
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                    }
                    else {
                        return done(null, user);
                    }
                });
            });

        }));

};