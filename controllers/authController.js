const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel.js');
const dotenv = require('dotenv').config;
const generateToken = require('../utils/generateToken.js');

module.exports.registerUser = async (req, res) => {
  try {
    let { fullname, email, password } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      req.flash('login', 'user already exists, you might want to login');
      return res.redirect('/');
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const createdUser = await userModel.create({
      fullname,
      email,
      password: hash,
    });

    const token = generateToken(createdUser);
    res.cookie('token', token);
    console.log('User created successfully');
    res.redirect('/home');
  }
  catch (err) {
    console.log(err.message);
    res.redirect('/');

  }
}

module.exports.loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      req.flash('register', 'user does not exist, you might want to register');
      return res.redirect('/register');
    }
    else {
      const compare = bcrypt.compare(password, user.password)
      if (compare) {
        const token = generateToken(user);
        res.cookie('token', token);
        req.flash('sucessfull', 'User logged in successfully');
        return res.redirect('/home');
      }
      else {
        req.flash('login', 'Incorrect Password');
        return res.redirect('/login');

      }

    }
  }
  catch (err) {
    console.log(err.message);
  }
}

module.exports.logoutUser = (req, res) => {
  res.cookie('token', '');
  console.log('logged out successfully!');
  return res.redirect('/');
}