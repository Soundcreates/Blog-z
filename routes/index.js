const express = require('express');
const route = express.Router();
const { registerUser, loginUser, logoutUser } = require('../controllers/authController.js');
const { postController, createPost, createComment, postCreate, deletePost, seePost, editPost, editedPost, friendPosts } = require('../controllers/postController.js');
const { LogMiddleware } = require('../middlewares/isLoggedIn.js')
const { profileController } = require('../controllers/profileController.js');
const { addFriend, acceptFriend, rejectFriend } = require('../controllers/friendController.js');


route.get('/', (req, res) => {
  res.render('index.ejs');
})

route.get('/register', (req, res) => {
  res.render('register.ejs');

})

route.post('/create', registerUser);
route.post('/login', loginUser);
route.get('/createPost', LogMiddleware, createPost)
route.post('/postCreate', postCreate);
route.get('/home', LogMiddleware, postController)
route.get('/logout', logoutUser);
route.get('/deletePost/:id', deletePost);
route.get('/editPost/:id', LogMiddleware, editPost);
route.post('/editedPost/:id', editedPost);
route.get('/seePost/:id', LogMiddleware, seePost);
route.post('/createComment/:id', createComment);
route.get('/profile', LogMiddleware, profileController);
route.post('/addFriend/:id', LogMiddleware, addFriend);
route.post('/acceptFriend/:id', acceptFriend);
route.post('/rejectFriend/:id', rejectFriend);
route.get('/friendPosts/:id', friendPosts);
module.exports = route;