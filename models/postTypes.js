var mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');

var postTypeSchema = new mongoose.Schema({
   name: { type: String, unique: true, required:true },
   icon: String,
   color: String
});

postTypeSchema.plugin(uniqueValidator);

module.exports = mongoose.model("PostType", postTypeSchema);
