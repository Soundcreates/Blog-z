const express = require('express');
const mongoose = require('mongoose');
const postModel = require('../models/postModel.js');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel.js');
const commentModel = require('../models/commentModel.js');

module.exports.postController = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.redirect('/');
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = decoded.id; //these two lines helped me get the user who is logged in

    const posts = await postModel.find({ author: user }).populate('author').limit(5);

    let otherPosts = await postModel.find({ author: { $ne: user } }).populate('author');
    let currentUser = await userModel.findById(user);

    res.render('home.ejs', { posts, otherPosts, currentUser });
  }
  catch (err) {
    console.log(err.message);
    res.redirect('/');
  }

}
module.exports.createPost = async (req, res) => {

  const token = req.cookies.token;
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  const user = decoded.id;
  const currentUser = await userModel.findOne({ _id: user });

  if (!currentUser) {
    return res.redirect('/');
  }

  res.render('createPost.ejs', { currentUser })
}

module.exports.postCreate = async (req, res) => {
  let { title, content } = req.body;

  let token = req.cookies.token;
  let decoded = jwt.verify(token, process.env.JWT_KEY);
  let user = decoded.id;

  let findAuthor = await userModel.findOne({ _id: user });

  if (!findAuthor) {
    return res.redirect('/');
  }

  let createdPost = await postModel.create({
    title,
    content,
    author: user
  });

  await userModel.findOneAndUpdate({ _id: user }, {
    $push: { posts: createdPost._id }
  })
  res.redirect('/home');
}

module.exports.deletePost = async (req, res) => {
  let postId = req.params.id;
  const post = await postModel.findById(postId);

  if (post) {
    await userModel.findByIdAndUpdate({ _id: post.author._id }, {
      $pull: { posts: postId }
    });
    await commentModel.deleteMany({ post: postId });
  }
  await postModel.findByIdAndDelete(postId);
  res.redirect('/home');
}

module.exports.seePost = async (req, res) => {
  let postId = req.params.id;
  let token = req.cookies.token;
  let decoded = jwt.verify(token, process.env.JWT_KEY);
  let userId = decoded.id;
  let currentUser = await userModel.findById(userId).populate('friends');

  let friendIds = currentUser.friends.map(friend => friend._id);


  let post = await postModel.findOne({ _id: postId }).populate('author');


  if (!post) {
    return res.redirect('/home'); // or show an error page
  }
  let comments = await commentModel.find({ post: postId }).populate('author');

  res.render('seePost.ejs', { post, comments, currentUser });
}

module.exports.editPost = async (req, res) => {
  let postId = req.params.id;

  let post = await postModel.findById(postId);

  res.render('editPost.ejs', { post });
}

module.exports.editedPost = async (req, res) => {
  let postId = req.params.id;
  let { title, content } = req.body;
  let UpdatedPost = await postModel.findOneAndUpdate({ _id: postId }, { title, content });

  res.redirect('/home');
}



module.exports.createComment = async (req, res) => {
  let postId = req.params.id;
  let { commentContent } = req.body;

  let token = req.cookies.token;
  let decoded = jwt.verify(token, process.env.JWT_KEY);
  let user = decoded.id;


  let comment = await commentModel.create({
    commentContent,
    author: user,
    post: postId,
  })
  await userModel.findByIdAndUpdate(user, {
    $push: { comments: comment._id }
  })
  res.redirect(`/seePost/${postId}`);
}

module.exports.friendPosts = async (req, res) => {
  let userId = req.params.id;

  let user = await userModel.findById(userId).populate('friends', '_id');

  let friendIds = user.friends.map(friend => friend._id);

  let posts = await postModel.find({ author: { $in: friendIds } }).populate('author');


  res.render('friendPosts.ejs', { friendsId: friendIds, posts });
}