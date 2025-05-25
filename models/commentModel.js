const mongoose = require('mongoose');

let commentSchema = mongoose.Schema({
  commentContent: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
})

module.exports = mongoose.model('comment', commentSchema);