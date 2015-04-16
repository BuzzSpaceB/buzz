/**
 * strategy for loging in using a username and a password
 * @param passport passport node module
 * @param ds the DatabaseStuff module , contains all the schemas and functionality for reading from the database.
 */
module.exports = function (passport, ds) {

    var LocalStrategy = require('passport-local').Strategy;
    var User       = ds.models.user;

    /**
     * Converts a user to an user_id (student number) only, used internally by Passport
     */
    passport.serializeUser(function (user, done) {
        done(null, user.user_id);
    });

    /**
     * Converts a user_id (student number) to a full user object, used internally by Passport
     */
    passport.deserializeUser(function (user_id, done) {
        User.findOne({user_id:user_id}, function(err, user) {
            done(err, user);
        });
    });

    /**
     * Using the locat passport strategy, log a user in using username and password
     */
    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with username
            usernameField: 'username', // The username is a students student number e.g. user_id === u00000004
            passwordField: 'password', //for demo purposes all passwords are "password"
            passReqToCallback: true
        },
        function (req, username, password, done) {
            var user_id = username;
            //username is student number

            // this happens asynchronously
            process.nextTick(function () {

                //find the user using the user_id (student number)
                User.findOne({ 'user_id' :  user_id }, function(err, user) {
                    if (err)
                        return done(err);
                    if (!user) { //if the user doesn't exist in our database , i.e. no user with that student number
                        //TODO: check lpdap if it is a new user, e.g. first year if new user add to our local db
                        return done(null, false, req.flash('loginMessage', 'Username or password is incorrect!'));
                    }
                    if (!user.validPassword(password)) { //check to see if the passwords match, this function is defined in the schema for users
                        return done(null, false, req.flash('loginMessage', 'Username or password is incorrect!'));
                    }
                    else { //if the user exists, and password is correct pass user object to next function
                        return done(null, user);
                    }
                });
            });

        }));
};