var mongoose = require("mongoose");
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var commentSchema = mongoose.Schema({
  content: String,
  createdAt: {type: Date, default: Date.now},
  users:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    },
    avatar: String,
    username: String
});

commentSchema.plugin(deepPopulate);

module.exports = mongoose.model("Comment",commentSchema);
