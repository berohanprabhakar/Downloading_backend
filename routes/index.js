var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./post");
const passport = require('passport');
const upload = require('./multer');


// through this line user will get login
const localStrategy = require("passport-local");
const { route } = require('../app');
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */

router.get('/',function(req,res,next){
  res.render('index');
});
// upload app page render router
router.get('/uploadapp',isLoggedIn,async function(req,res,next){
  const user = await userModel.findOne({username:req.session.passport.user});
  res.render('uploadapp',{user});
});

// showing all the posts by user
router.get('/show/posts',isLoggedIn,async function(req,res,next){
  const user = await userModel
  .findOne({username:req.session.passport.user})
  .populate("posts")
  res.render('allpost',{user});
});

// route for uploading apk file
router.post('/uploadapp',isLoggedIn,upload.single("apkFile"),async function(req,res,next){
  const user = await userModel.findOne({username:req.session.passport.user});
 const post = await postModel.create({
    user: user._id,
    appTitle: req.body.appTitle,
    appDescription :req.body.appDescription,
    apkFile: req.file.filename
  });

  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});

// dp upload router
router.post('/uploaddp',isLoggedIn,upload.single("apkFile"),async function(req,res,next){
  const user = await userModel.findOne({username:req.session.passport.user});
 const post = await postModel.create({
    user: user._id,
    appTitle: req.body.appTitle,
    appDescription :req.body.appDescription,
    apkFile: req.file.filename
  });

  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});

// rendering routes
router.get('/register',function(req,res,next){
  res.render('register');
});
router.get('/login',function(req,res,next){
  res.render('login');
});

// register route
router.post("/register", function(req,res,next){
  const userData = new userModel({
    name: req.body.fullname,
    username: req.body.username,
    email: req.body.email
  });

  userModel.register(userData, req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile")
    })
  })
});

// profile router
router.get('/profile',isLoggedIn, async function(req,res){
  const user = await userModel.findOne({
    username : req.session.passport.user
  })
  res.render('profile',{user});
});

// login router
router.post("/login",passport.authenticate("local",{
  successRedirect : "/profile",
  failureRedirect: "/login",
  failureFlash : true
}),function(req,res){
});

// logout router
router.post('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

// checking banda authenticated hai
function isLoggedIn(req,res,next){
  if(req.isAuthenticated())return next();
  res.redirect("/register");
};

module.exports = router;
