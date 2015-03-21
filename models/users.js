/**
 * Created by Anrich on 3/21/2015.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function()
{
    var User = new Schema({
        user_id     : String,
        profile_pic : { data: Buffer, contentType: String }, /* See https://gist.github.com/aheckmann/2408370 */
        preferred_email : String
    });
    mongoose.model("User", User);
};