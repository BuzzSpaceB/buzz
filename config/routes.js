module.exports = function (router, passport, ds) {

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
        var Space = ds.models.space;
        Space.find(function (err, spaces) {
            if (err) {
                console.log("ERR: " + err);
            }
            else {
                res.render('spaces', {
                    title: 'D3',
                    spaces: spaces,
                    user: req.user,
                    content: 'spaces'
                });
            }
        });
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

        try {
            var module = req.params.spaceName;
            var parent = null;
            getChildThreads(module, parent, req, res, threadCreateCallback);
        }
        catch (e) {
            console.log(e);
        }

    });


    router.post('/spaces/:spaceName', function (req, res) {
        var subject = req.body.subject;
        var post = req.body.content;
        var parent = null;
        var module = req.params.spaceName;
        try {
            createNewThread(subject, post, parent, module, req);
        }
        catch (e) {
            console.log(e);
        }
        res.end("done");
    });

    router.get('/spaces/:spaceName/:threadID', isLoggedIn, function (req, res) {
        try {
            var module = req.params.spaceName;
            var parent = req.params.threadID;
            getChildThreads(module, parent, req, res, threadCreateCallback);
        }
        catch (e) {
            console.log(e);
        }
    });

    router.post('/spaces/:spaceName/:threadID', function (req, res) {
        var subject = req.body.subject;
        var post = req.body.content;
        var parent = req.params.threadID;
        var module = req.params.spaceName;
        try {
            createNewThread(subject, post, parent, module);
        }
        catch (e) {
            console.log(e);
        }
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

    /*POSTING*/
    //This is what the functional teams had to write
    function postThreadToDatabase(JSONDetails) {
        //Set up the schema
        var Thread = ds.models.thread;
        //Create The Thread
        var newThread = new Thread();
        newThread.parent_thread_id = JSONDetails.ParentID;
        newThread.user_id = JSONDetails.UserID;
        newThread.num_children = JSONDetails.NumChildren;
        newThread.closed = JSONDetails.Closed;
        newThread.hidden = JSONDetails.Hidden;
        newThread.level = JSONDetails.Level;
        newThread.post_id = JSONDetails.Post;
        newThread.subject = JSONDetails.Subject;
        newThread.module_id = JSONDetails.Module;
        //This is how you save it
        newThread.save(function (err) {
            if (err) console.log("ERR: " + err);
            console.log("Saving: " + JSON.stringify(newThread));
        });
    }

    //This is what the functional integration teams had to write
    function createNewThread(subject, post, parentThread, module) {

        var Thread = ds.models.thread;
        //Find the level of the thread whose object_id is the same as the parent thread's ID (i.e. find the parent's level)
        if (parentThread == null) {
            var level = 1;
            //Construct a new Thread
            var newThreadJSON = {
                "ParentID": null,
                "UserID": "u12345678",
                "NumChildren": 0,
                "Closed": false,
                "Hidden": false,
                "Level": level,
                "Post": post,
                "Subject": subject,
                "Module": module
            };
            //Post it to the Database
            postThreadToDatabase(newThreadJSON);
        }
        else {
            Thread.findOne({'_id': parentThread}, function (err, parentThread) {
                if (err)
                    console.log("ERR: " + err);
                else {
                    //Set the child thread's level
                    var parentLevel = parentThread.level;
                    var parentID = parentThread._id;
                    var level = 0;
                    level = Number(parentLevel) + 1;
                    //Construct a new Thread
                    var newThreadJSON = {
                        "ParentID": parentID,
                        "UserID": "u12345678",
                        "NumChildren": 0,
                        "Closed": false,
                        "Hidden": false,
                        "Level": level,
                        "Post": post,
                        "Subject": subject,
                        "Module": module
                    };
                    //Post it to the Database
                    postThreadToDatabase(newThreadJSON);
                }
            });
        }

    }

    /*GETTING A POST*/
    /*This is what the functional teams had to write*/
    function getThreadFromDatabase(module, parent, req, res, getThreadCallback) {
        //Generate Threads from Database
        var Thread = ds.models.thread;
        //If no parent just find all the level 1 threads
        //Find the parent thread
        Thread.findOne({'_id': parent}, function (err, validThread) {
            if (err)
                console.log("ERR: " + err);
            else {
                //Create a JSON object consisting of that threads and return.
                var stringifiedJSON = JSON.stringify(validThread);
                var obj = JSON.parse(stringifiedJSON);
                getThreadCallback(obj, parent, req, res);
            }
        });

    }

    /*This is what the functional teams had to write*/
    function generateThreads(validThread) {
        //Generate those threads
        var threads = new Array();
        var amount = Number(Object.keys(validThread).length);
        var stringifiedJSON = JSON.stringify(validThread);
        var obj = JSON.parse(stringifiedJSON);
        for (var i = 0; i < amount; i++) {
            threads[i] = {
                heading: obj[i]["subject"],
                name: obj[i]["user_id"],
                level: obj[i]["level"],
                date: "Tue Apr 07 2015 13:32PM",
                post: obj[i]["post_id"],
                spaceName: obj[i]["module_id"],
                threadID: obj[i]["_id"],
                userID: obj[i]["user_id"],
                profilePick: "profile3.png",
                moduleID: obj[i]["module_id"]
            };

        }
        threads = JSON.stringify(threads);
        threads = JSON.parse(threads);
        return threads;
    }

    /*This is what the functional integration teams had to write*/
    function getChildThreads(module, parent, req, res, threadCreateCallback) {
        var Thread = ds.models.thread;
        //If no parent, just find all the level 1 threads
        if (parent == null) {
            //Find all the threads on level 1
            Thread.find({'level': 1}, function (err, validThread) {
                if (err)
                    console.log("ERR: " + err);
                else {
                    var threads = generateThreads(validThread);
                    threadCreateCallback(req, res, threads);
                }
            });
        }
        else {
            getThreadFromDatabase(module, parent, req, res, getThreadCallback);
        }
    }

//Callback Functions to emulate Synchronous Behaviour
    function getThreadCallback(parentDetails, parent, req, res) {
        var Thread = ds.models.thread;
        var stringifiedJSON = JSON.stringify(parentDetails);
        var obj = JSON.parse(stringifiedJSON);
        var childLevel = Number(obj.level) + 1;
        var module = obj.module_id;
        //Find the threads on level of the thread for this module whose parent is the thread we navigated to
        Thread.find({
            'level': childLevel,
            'module_id': module,
            'parent_thread_id': parent
        }, function (err, validThread) {
            if (err)
                console.log("ERR: " + err);
            else {
                var threads = generateThreads(validThread);
                threadCreateCallback(req, res, threads);
            }
        });
    }

    function threadCreateCallback(req, res, threads) {
        res.render('threads', {
            title: 'D3',
            threads: threads,
            user: req.user,
            content: 'This is the module code for a thread'
        });
    }
};