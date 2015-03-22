/**
 * Created by Anrich on 3/22/2015.
 */

/**
 * Technically this information shouldn't be stored in the MongoDB, since it's already on LDAP.
 * NOTE: Speak to CSDS team about this!
 * @type {*|exports}
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function()
{
    var Module = new Schema({
        module_id           : String,           /* The id of the module */
        name                : String,           /* The full name of the module */
        code                : String            /* The module code */
    });
    mongoose.model("Module", Module);
};