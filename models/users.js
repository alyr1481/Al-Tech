var mongoose              = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose"),
    bcrypt = require("bcrypt-nodejs"),
    deepPopulate = require('mongoose-deep-populate')(mongoose);

var UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required:true },
  email: { type: String, unique: true, required:true },
  password: String,
  bio: { type: String, deafult: ""},
  avatar: {type: String, default:"https://s3-eu-west-1.amazonaws.com/al-tech-avatars/picture-default.png"},
  createdAt: {type: Date, default: Date.now},
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  verificationToken: String,
  verified: {type: Boolean, default: false},
  isAdmin: {type: Boolean, default: false},
  isModerator: {type: Boolean, default: false}
});

UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(deepPopulate);

module.exports = mongoose.model("User",UserSchema);
