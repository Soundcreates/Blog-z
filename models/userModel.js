const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
  fullname: String,
  email: String,
  password: String,
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'post',
    }
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'comment',
    }
  ],
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    }
  ],
  friendRequestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  friendRequestsRecieved: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
})

module.exports = mongoose.model('user', userSchema);