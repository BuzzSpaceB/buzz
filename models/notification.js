/**
 * Created by Anrich on 3/22/2015.
 */

var mongoose = require('mongoose');



var NotificationSchema = new mongoose.Schema({
    notification_id             : String,            /* PK */
    thread_id                   : String,           /* Notifications relate to a specific thread */
    user_id                     : String,           /* A notification will be sent to a specific user */
    date_time                   : Date,             /* A notification will show its date and time */
    type                        : String,           /* Each notification has a type, like Delete, New Post etc. */
    content                     : String,           /* The actual notification text */
    read                        : Boolean           /* Flag to show notification has been read */
});

module.export = mongoose.model("Notification", NotificationSchema);
