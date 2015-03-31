/**
 * Created by Anrich on 3/21/2015.
 */

/* See http://stackoverflow.com/questions/10081611/mongoose-schema-creation */

var models = ['user.js', 'thread.js', 'post.js', 'subscription.js', 'notification.js', 'login_authentication.js', 'role.js', 'module.js', 'appraisal.js'];

exports.initialize = function()
{
    var len = models.length;
    for(var i = 0; i < len; ++i)
    {
        require(models[i])();
    }
};