/**
 * Created by Anrich on 3/22/2015.
 */

/**
 * Technically this information shouldn't be stored in the MongoDB, since it's already on LDAP.
 * NOTE: Speak to CSDS team about this!
 * @type {*|exports}
 */

var mongoose = require('mongoose');


var ModuleSchema = new mongoose.Schema({
    module_id           : String,           /* The id of the module */
    name                : String,           /* The full name of the module */
    code                : String            /* The module code */
});

module.exports = mongoose.model("Module", ModuleSchema);
