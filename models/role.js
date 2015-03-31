/**
 * Created by Anrich on 3/22/2015.
 */

/**
 * Technically this information shouldn't be stored in the MongoDB, since it's already on LDAP.
 * NOTE: Speak to CSDS team about this!
 * @type {*|exports}
 */

var mongoose = require('mongoose');


    var RoleSchema = new mongoose.Schema({
        role_id         : String,           /* The id of the role */
        name            : String            /* The name of the role, as from LDAP */
    });


module.exports = mongoose.model("Role", RoleSchema);
