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

    //router.get('/spaces', isLoggedIn, function (req, res) {
    //
    //    res.render('spaces', {title: 'D3',  user: req.user, content: 'spaces'});
    //});

    router.get('/spaces', isLoggedIn, function (req, res) {

        var spaces = [
            {
                spaceName: "COS301",
                spaceDescription: "Software Engineering",
                latestPost: "Some post name"

            },
            {
                spaceName: "COS 314",
                spaceDescription: "Artificial Intelligence",
                latestPost: "Some Other Post"
            },
            {
                spaceName: "COS 332",
                spaceDescription: "Computer Networks",
                latestPost: "My random Post"
            }
        ];


        res.render('spaces', {title: 'D3', spaces:spaces,  user: req.user, content: 'spaces'});
    });

    router.param("spaceName", function (req, res, next, moduleCode) {
        console.log("Validating " + moduleCode);
        next();
    });

    router.param("threadID", function (req, res, next, threadID) {
        console.log("Validating 2+" + threadID);
        next();
    });

    router.get('/spaces/:spaceName', isLoggedIn, function (req, res) {
        var threads = [
            {   heading: "Thread Heading",
                name: "Jacob Zuma",
                level: "Presedent (level 10)",
                date: "Tue Apr 07 2015 13:32PM",
                post: "I will not pay back the money.",
                spaceName: req.params.spaceName,
                threadID: "1",
                userID: "u99999999",
                profilePick :"profile3.png"
            },
            {   heading: "Thread Heading Also",
                name: "Anric van Schalkwyk",
                level: "Jester (level 0)",
                date: "Tue Apr 07 2015 13:32PM",
                post: "Mediumm length reply? WHy so many whitespace? Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
                spaceName: req.params.spaceName,
                threadID: "2",
                userID: "u21321312",
                profilePick :"profile.png"
            },
            {
                heading: "I need help with a Heading",
                name: "Tiennie Pritchard Now with a very bvery very very very long name",
                level: "Pesant (level -100)",
                date: "Tue Apr 07 2015 13:32PM",
                post: "Very short reply.",
                spaceName: req.params.spaceName,
                threadID: "3",
                userID: "u11234567",
                profilePick :"profile2.gif"
            }
        ];
        res.render('threads', {title: 'D3', threads: threads, user: req.user, content: 'This is the module code for a thread'});
    });

    router.get('/spaces/:spaceName/:threadID', isLoggedIn, function (req, res) {
        var threads = [
            {   heading: "Thread Heading",
                name: "Jacob Zuma",
                level: "Presedent (level 10)",
                date: "Tue Apr 07 2015 13:32PM",
                post: "I will not pay back the money.",
                spaceName: req.params.spaceName,
                threadID: req.params.threadID,
                userID: "u99999999",
                profilePick :"profile3.png"
            },
            {   heading: "Thread Heading Also",
                name: "Anric van Schalkwyk",
                level: "Jester (level 0)",
                date: "Tue Apr 07 2015 13:32PM",
                post: "Mediumm length reply? WHy so many whitespace? Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
                spaceName: req.params.spaceName,
                threadID: req.params.threadID,
                userID: "u21321312",
                profilePick :"profile.png"
            },
            {
                heading: "I need help with a Heading",
                name: "Tiennie Pritchard Now with a very bvery very very very long name",
                level: "Pesant (level -100)",
                date: "Tue Apr 07 2015 13:32PM",
                post: "Very short reply.",
                spaceName: req.params.spaceName,
                threadID: req.params.threadID,
                userID: "u11234567",
                profilePick :"profile2.gif"
            }
        ];
        res.render('threads', {title: 'D3', threads: threads, user: req.user, content: 'This is the module code for a thread'});
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

