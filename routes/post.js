const mongoose = require('mongoose');


// Define post schema
const PostSchema = new mongoose.Schema({
 // this is for remembering malik for every post
user:{
  type: mongoose.Schema.Types.ObjectId,
  // this is for referencing which model data we are fetching
  ref: 'User'
},
appTitle: {
    type: String,
    required: true
},
appDescription: {
    type: String,
    required: true
},
apkFile: String,
appDp: String,
appImage: [String],
appCategory: {
  type: String,
  enum: ['Game', 'App', 'Tools'], // Predefined categories
  default: 'App' // Default category
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
