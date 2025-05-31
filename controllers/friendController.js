const postModel = require('../models/postModel.js');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel.js');
const commentModel = require('../models/commentModel.js');


module.exports.addFriend = async (req, res) => {

  try {
    let otherId = req.params.id;
    let token = req.cookies.token;
    let decoded_user = jwt.verify(token, process.env.JWT_KEY);
    let userId = decoded_user.id;

    if (userId === otherId) return res.status(400).send("Cannot friend yourself");

    let currentUser = await userModel.findById(userId);
    let otherUser = await userModel.findById(otherId);

    if (!currentUser || !otherUser) {
      return res.status(404).send("User not found");

    }

    if (currentUser.friends.includes(otherId)) {
      return res.status(400).send("Already friends.");
    }

    if (!currentUser.friendRequestsSent.includes(otherId)) {
      currentUser.friendRequestsSent.push(otherId);
      await currentUser.save();
    }

    if (!otherUser.friendRequestsRecieved.includes(userId)) {
      otherUser.friendRequestsRecieved.push(userId);
      await otherUser.save();
    }


    res.redirect('/home');
    console.log("Friend request sent");

  } catch (err) {
    console.log(err.message);
  }

};

module.exports.acceptFriend = async (req, res) => {
  try {
    let otherId = req.params.id;
    let token = req.cookies.token;
    let decoded = jwt.verify(token, process.env.JWT_KEY);
    let userId = decoded.id;

    let currentUser = await userModel.findById(userId);
    let otherUser = await userModel.findById(otherId);

    currentUser.friendRequestsRecieved = currentUser.friendRequestsRecieved.filter(id => id.toString() !== otherId);
    currentUser.friends.push(otherId);
    await currentUser.save();

    otherUser.friendRequestsSent = otherUser.friendRequestsSent.filter(id => id.toString() !== userId);
    otherUser.friends.push(userId);
    await otherUser.save();

    res.redirect('/profile');

  } catch (err) {
    console.log(err.message);
  }
};

module.exports.rejectFriend = async (req, res) => {

};
