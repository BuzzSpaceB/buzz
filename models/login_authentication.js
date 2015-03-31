/**
 * Created by Anrich on 3/22/2015.
 */

/**
 * Technically this information shouldn't be stored in the MongoDB, since it's already on LDAP.
 * NOTE: Speak to CSDS team about this!
 * @type {*|exports}
 */

var mongoose = require('mongoose');


var LoginAuthenticationSchema = new mongoose.Schema({
    user_id             : String,           /* PK, this is the user_id as in LDAP */
    username            : String,           /* The user's preferred username, like first name */
    password            : String,           /* The password of the user */
    logged_in           : Boolean,          /* Flag to show whether user is logged in */
    roles               : [{role_name : [String], module_in_roles: [String]}],      /* Roles of the user as from LDAP */
    active_modules      : [String]          /* Modules that is active for the user */
});

module.exports = mongoose.model("LoginAuthentication", LoginAuthenticationSchema);
