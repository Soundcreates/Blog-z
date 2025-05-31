const express = require('express');
const route = express.Router();
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const commentModel = require('../models/commentModel.js');

module.exports.profileController = async (req, res) => {
  let token = req.cookies.token;
  let decoded = jwt.verify(token, process.env.JWT_KEY);
  // let user = await userModel.findById(decoded.id).populate('posts').populate({
  //   path: 'comments',
  //   populate: { path: 'post' }
  // }); //no idea how this usermodel.findbyid block worked

  let user = await userModel.findById(decoded.id).populate('comments').populate('posts').populate('friends', 'fullname').populate('friendRequestsSent', 'fullname').populate('friendRequestsRecieved', 'fullname');
  let foundcomments = await commentModel.find({ author: decoded.id }).populate('post');

  res.render('profile.ejs', { user, foundcomments })
}