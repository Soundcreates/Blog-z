
module.exports.LogMiddleware = (req, res, next) => {
  if (req.cookies.token === "") {
    res.redirect('/login');
  }
  else {
    next();
  }
}