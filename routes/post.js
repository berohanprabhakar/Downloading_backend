const mongoose = require('mongoose');


// Define post schema
const PostSchema = new mongoose.Schema({
  postImage: {
    type: String
  },
  appTitle: {
    type: String
  },
  appDescription: String,
  apkFile: String,

  // this is for remembering malik for every post
  user:{
    type: mongoose.Schema.Types.ObjectId,
    // this is for referencing which model data we are fetching
    ref: 'User'
  },
  createdAt:{
    type: Date,
    default: Date.now(),
  },
  likes: {
    type: Number,
    default: 0
  }
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
