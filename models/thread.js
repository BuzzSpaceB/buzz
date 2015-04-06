var mongoose = require('mongoose');

var ThreadSchema = new mongoose.Schema({
    ID: mongoose.Schema.Types.ObjectId,
    User: String,
    Parent: mongoose.Schema.Types.ObjectId,
    Level: Number,
    Post: mongoose.Schema.Types.ObjectId,
    Status: mongoose.Schema.Types.ObjectId,
    Children: [mongoose.Schema.Types.ObjectId]
});
//
module.exports = mongoose.model("threads", ThreadSchema);
