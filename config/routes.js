var User = require('../models/user');
//var users  = require('../models/UserModel');
module.exports = function (router, passport) {

    /**
     * All pages
     */
    router.all('*', function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    });

    router.get('/', function (req, res, next) {
        res.render('index', {title: 'D3', user: req.user, message: req.flash('loginMessage')});
    });

    /**
     * GET home page.
     */
    router.get('/t', function (req, res, next) {
        var newStudent = new User();
        newStudent.username = "u12345678";
        newStudent.password = "password";
        newStudent.save(function (err) {
            if (err) console.log("ERR: " + err);
            console.log("Saving: " + JSON.stringify(newStudent));
        });

        User.find(function (err, fs) {
            if (err)
                console.log("ERR: " + err);
            else
                console.log("Found: " + JSON.stringify(fs));
        });

        res.send('test file');
    });

    router.get('/logout', function (req, res) {
        var name = req.user.username;
        console.log("LOGGIN OUT " + name);
        req.logout();
        res.redirect('/');
        req.session.notice = "You have successfully been logged out " + name + "!";
    });


    /**/
    router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/spaces',
        failureRedirect: '/',
        failureFlash: true
    }));

    router.get('/spaces', isLoggedIn, function (req, res) {

        res.render('spaces', {title: 'D3',user: req.user, content: 'spaces'});
    });

    router.param("moduleCode", function (req, res, next, moduleCode) {
        console.log("Validating " + moduleCode);
        next();
    });

    router.param("threadID", function (req, res, next, threadID) {
        console.log("Validating 2+" + threadID);
        next();
    });

    router.get('/spaces/:moduleCode', isLoggedIn, function (req, res) {
        res.render('threads', {title: 'D3',user: req.user, content: 'This is the module code for a thread'});
    });

    router.get('/spaces/:moduleCode/:threadID', isLoggedIn, function (req, res) {
        res.render('index', {title: 'D3',user: req.user, content: 'index'});
    });

    /*
     * This function will route through the isLoggedIn function before sending the page
     */
    router.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile', {title: 'D3', content: 'Profile & Settings'});
    });

    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {
        console.log("In function isLoggedIn: \tREQ:");
        console.log(req.user);
        // if user is authenticated in the session, carry on
        if (req.user)
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/');
    }

};

