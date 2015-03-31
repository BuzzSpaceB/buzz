/**
 * Created by Anrich on 3/31/2015.
 */

var mongoose = require('mongoose');

var ServiceSchema = mongoose.Schema({
    service_id                  : ObjectId,
    service_name                : String, /*Fully qualified service name */
    method_name                 : String,
    deleted                     : Boolean
});

module.exports = mongoose.model('Service', ServiceSchema);