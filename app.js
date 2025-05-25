const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();
const connectDB = require('./config/db.js');
const session = require('express-session');
const flash = require('connect-flash');
connectDB();

app.use(session({
  secret: process.env.JWT_KEY,
  resave: false,
  saveUninitialized: false
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
})
const indexRoute = require('./routes/index.js');

app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));




app.use('/', indexRoute);





app.listen(3000);
