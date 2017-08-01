var mongoose              = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required:true },
  email: { type: String, unique: true, required:true },
  password: String,
  createdAt: {type: Date, default: Date.now},
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  verified: {type: Boolean, default: false},
  isAdmin: {type: Boolean, default: false},
  avatar: {type: String, default:"https://s3-eu-west-1.amazonaws.com/al-tech-avatars/picture-default.png"}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",UserSchema);
