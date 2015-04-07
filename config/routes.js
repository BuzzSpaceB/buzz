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
        //Generate Threads from Database
        var amount = 0;
        var threads = new Array();
        var Thread = require('../models/thread');

        var module = req.params.spaceName;
        //Find the threads on level 1 for this module
        Thread.find({'level' : "1", 'module_id' : module }, function (err, validThread)
        {

                if (err)
                    console.log("ERR: " + err);
                else {
                    //Generate those threads
                    amount = Number(Object.keys(validThread).length);
                    var stringifiedJSON = JSON.stringify(validThread);
                    console.log(stringifiedJSON);
                    var obj = JSON.parse(stringifiedJSON);
                    for(var i = 0; i < amount; i++)
                    {
                        threads[i] = {
                            heading: obj[i]["subject"],
                            name: obj[i]["user_id"],
                            level: obj[i]["level"],
                            date: "Tue Apr 07 2015 13:32PM",
                            post: obj[i]["post_id"],
                            spaceName: obj[i]["module_id"],
                            threadID: obj[i]["thread_id"],
                            userID: obj[i]["user_id"],
                            profilePick: "profile3.png",
                            moduleID: obj[i]["module_id"]
                        };
                     }
                    threads = JSON.stringify(threads);
                    threads = JSON.parse(threads);
                    res.render('threads', {title: 'D3', threads: threads, user: req.user, content: 'This is the module code for a thread'});
                }
        });
    });

    router.post('/spaces/:spaceName',function(req,res)
    {
        var subject=req.body.subject;
        var post=req.body.content;

        var Thread = require('../models/thread');
        //Check How Many Threads Are In The Database So You Can Form The ThreadID
        var threadID = 0;
        Thread.find(function (err, aThread)
        {
            if (err)
                console.log("ERR: " + err);
            else
            {
                console.log("Found: " + JSON.stringify(aThread));
                threadID = Number(Object.keys(aThread).length) + 1;
                var len = Number(Object.keys(aThread).length);
                console.log(len + " " + threadID);
                var newThread = new Thread();

                newThread.thread_id = threadID;
                console.log(newThread.thread_id);
                //This is a level 1 thread, so no parent (i.e. the parent is the current thread).
                newThread.parent_thread_id = threadID;
                newThread.user_id = "u12345678";
                newThread.num_children = 0;
                newThread.closed = false;
                newThread.hidden = false;
                newThread.level = "1";
                newThread.post_id = post;
                newThread.subject = subject;
                newThread.module_id = req.params.spaceName;

                //This is how you save it
                newThread.save(function (err) {
                    if (err) console.log("ERR: " + err);
                    console.log("Saving: " + JSON.stringify(newThread));
                });

            }

        });
        res.end("done");
    });

    router.get('/spaces/:spaceName/:threadID', isLoggedIn, function (req, res) {
        //Generate Threads from Database
        var amount = 0;
        var threads = new Array();
        var Thread = require('../models/thread');
        var module = req.params.spaceName;
        var parent = req.params.threadID;

        //Find the details of the thread we're exploring
        Thread.find({'thread_id': parent}, function (err, validThread)
        {
            if (err)
                console.log("ERR: " + err);
            else {
                //Generate those threads
                var stringifiedJSON = JSON.stringify(validThread);
                console.log(stringifiedJSON);
                var obj = JSON.parse(stringifiedJSON);
                console.log(obj[0].level);
                var parentLevel = 0;
                parentLevel = obj[0].level + 1;
                console.log("Level: " + parentLevel);
                console.log("Module: " + module);
                console.log("Parent: " + parent);
                //Find the threads on level of the thread for this module whose parent is the thread we navigated to
                Thread.find({'level' : parentLevel, 'module_id' : module, 'parent_thread_id' : parent }, function (err, validThread)
                {

                    if (err)
                        console.log("ERR: " + err);
                    else {
                        //Generate those threads
                        amount = Number(Object.keys(validThread).length);
                        var stringifiedJSON = JSON.stringify(validThread);
                        console.log(stringifiedJSON);
                        var obj = JSON.parse(stringifiedJSON);
                        for(var i = 0; i < amount; i++)
                        {
                            threads[i] = {
                                heading: obj[i]["subject"],
                                name: obj[i]["user_id"],
                                level: obj[i]["level"],
                                date: "Tue Apr 07 2015 13:32PM",
                                post: obj[i]["post_id"],
                                spaceName: obj[i]["module_id"],
                                threadID: obj[i]["thread_id"],
                                userID: obj[i]["user_id"],
                                profilePick: "profile3.png",
                                moduleID: obj[i]["module_id"]
                            };
                        }
                        threads = JSON.stringify(threads);
                        threads = JSON.parse(threads);
                        res.render('threads', {title: 'D3', threads: threads, user: req.user, content: 'This is the module code for a thread'});
                    }
                });
            }
        });
    });
    router.post('/spaces/:spaceName/:threadID',function(req,res)
    {
        var subject=req.body.subject;
        var post=req.body.content;

        var Thread = require('../models/thread');
        //Check How Many Threads Are In The Database So You Can Form The ThreadID
        var threadID = 0;
        Thread.find(function (err, aThread) {
            if (err)
                console.log("ERR: " + err);
            else
            {
                console.log("Found: " + JSON.stringify(aThread));
                threadID = Number(Object.keys(aThread).length) + 1;
            }

        });
        //The parent thread is the current thread
        var parentThread = req.params.threadID;

        //Get the parent thread's level
        var parentLevel;
        Thread.findOne({ 'thread_id' :  parentThread }, function (err, aThread) {
            if (err)
                console.log("ERR: " + err);
            else
            {
                var stringifiedJSON = JSON.stringify(aThread);
                var obj = JSON.parse(stringifiedJSON);
                parentLevel = obj["level"];

                var newThread = new Thread();

                newThread.thread_id = threadID;
                //This is a level 1 thread, so no parent.
                newThread.parent_thread_id = parentThread;
                newThread.user_id = "u12345678";
                newThread.num_children = 0;
                newThread.closed = false;
                newThread.hidden = false;
                newThread.level = Number(parentLevel)+1;
                newThread.post_id = post;
                newThread.subject = subject;
                newThread.module_id = req.params.spaceName;

                //This is how you save it
                newThread.save(function (err) {
                    if (err) console.log("ERR: " + err);
                    console.log("Saving: " + JSON.stringify(newThread));
                });
            }
        });




        res.end("done");
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

