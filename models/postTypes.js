var mongoose = require("mongoose");

var postTypeSchema = new mongoose.Schema({
   name: String,
   icon: String,
   color: String
});

module.exports = mongoose.model("PostType", postTypeSchema);
