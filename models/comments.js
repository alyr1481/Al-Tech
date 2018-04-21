var mongoose = require("mongoose");

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


module.exports = mongoose.model("Comment",commentSchema);
