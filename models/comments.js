var mongoose = require("mongoose")

var commentSchema = mongoose.Schema({
  content: String,
  createdAt: {type: Date, default: Date.now},
  author: String
});

module.exports = mongoose.model("Comment",commentSchema);
