/**
 * Created by Anrich on 3/21/2015.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function()
{
    var Post = new Schema({
        post_id         : String,           /* PK */
        title           : String,            /* The title of the post */
        post_type       : String,           /* Thee type of post, like Question, Comment, Answer etc */
        content         : String,           /* The actual text content of the post */
        date            : Date,             /* The date and time the post was made */
        mime_type       : String            /* The MIME type of the post, like HTML */
    });
    mongoose.model("Post", Post);
};