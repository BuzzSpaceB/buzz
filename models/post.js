var mongoose = require('mongoose');

var PostSchema = mongoose.Schema({
    ID: mongoose.Schema.Types.ObjectId,
    PostType: String,
    Heading: String,
    Content: String,
    DateCreated: Date,
    MimeType: String
});

module.export = mongoose.model("posts", PostSchema);
