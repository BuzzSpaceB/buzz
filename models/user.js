
var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    username     : String,
    password     : String,
    user_id      : String
});


UserSchema.methods.validPassword = function(password) {
    console.log("Validating password : " + password);
    return password == "password";
};

module.exports = mongoose.model('User', UserSchema);