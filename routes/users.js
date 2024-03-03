const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/Downloading_app_DB");
// Define user schema
const UserSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  dp: {
    type: String
  },
  email: {
    type: String
  }
  
});

UserSchema.plugin(plm);
const User = mongoose.model('User', UserSchema);

module.exports = User;
