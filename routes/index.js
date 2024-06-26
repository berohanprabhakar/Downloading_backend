var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./post");
const passport = require('passport');
// const upload = require('./multer');
const { uploadApp, uploadDP } = require('./multer'); // Import multer configurations


// through this line user will get login
const localStrategy = require("passport-local");
const { route } = require('../app');
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */

router.get('/',function(req,res,next){
  res.render('index',{nav:false});
});
// upload app page render router : this will redirect to uploadapp route
router.get('/uploadapp',isLoggedIn,async function(req,res,next){
  const user = await userModel.findOne({username:req.session.passport.user});
  res.render('uploadapp',{user,nav:true});
});

// Route for uploading app
router.post('/uploadapp', isLoggedIn, uploadApp.fields([
  { name: 'apkFile', maxCount: 1 },
  { name: 'appDp', maxCount: 1 },
  { name: 'appImage', maxCount: 3 }
]), async function(req, res, next) {
      const user = await userModel.findOne({ username: req.session.passport.user });
      const post = await postModel.create({
          user: user._id,
          appTitle: req.body.appTitle,
          appDescription: req.body.appDescription,
          apkFile: req.files['apkFile'][0].filename,
          appDp: req.files['appDp'][0].filename,
          appImage: req.files['appImage'].map(file => file.filename)
      });

      user.posts.push(post._id); // this will push the post id in posts so that user can record he has posted
      await user.save();
      res.redirect("/profile");
});

// Route for uploading user display picture (DP)
router.post('/uploaddp', isLoggedIn, uploadDP.single('userdp'), async function(req, res, next) {
  try {
      // Handle uploading user DP logic
      const user = await userModel.findOne({ username: req.session.passport.user });
      user.dp = req.file.filename;
      await user.save();
      res.redirect("/profile");
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});


// [[ THIS one is for uploading only single file as apk ]]
// // route for uploading apk file
// router.post('/uploadapp',isLoggedIn,uploadApp.single("apkFile"),async function(req,res,next){
//   const user = await userModel.findOne({username:req.session.passport.user});
//  const post = await postModel.create({
//     user: user._id,
//     appTitle: req.body.appTitle,
//     appDescription :req.body.appDescription,
//     apkFile: req.file.filename
//   });

//   user.posts.push(post._id);
//   await user.save();
//   res.redirect("/profile");
// });

// showing all the posts by user
router.get('/feed',isLoggedIn,async function(req,res,next){
  const user = await userModel.findOne({username:req.session.passport.user})
  const posts = await postModel.find()
  .populate("user")
  res.render('feed',{user,posts,nav:true});
});
// rendering routes
router.get('/register',function(req,res,next){
  res.render('register',{nav:false});
});
router.get('/login',function(req,res,next){
  res.render('login',{nav:false});
});

// register route
router.post("/register", function(req,res,next){
  const userData = new userModel({
    name: req.body.name,
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
     username: req.session.passport.user 
  })
  .populate("posts") // this populate will show all the posts from that user
  console.log(user);
  res.render('profile',{user,nav:true});
});

// login router
router.post("/login",passport.authenticate("local",{
  successRedirect : "/profile",
  failureRedirect: "/login"
}),function(req,res){
});

// logout router
router.get('/logout', function(req, res, next){
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
