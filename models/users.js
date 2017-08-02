var mongoose              = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required:true },
  email: { type: String, unique: true, required:true },
  password: String,
  bio: String,
  avatar: {type: String, default:"https://s3-eu-west-1.amazonaws.com/al-tech-avatars/picture-default.png"},
  createdAt: {type: Date, default: Date.now},
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  verified: {type: Boolean, default: false},
  isAdmin: {type: Boolean, default: false},
  isModerator: {type: Boolean, default: false}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",UserSchema);
