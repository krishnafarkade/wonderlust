const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js")

const userController = require("../controllers/user.js");

router.route("/sighup")
.get(userController.renderSighupForm)
.post(userController.sighup);

router.route("/login")
.get(userController.renderloginForm)
.post( saveRedirectUrl,
    passport.authenticate('local', { failureRedirect: '/login' , failureFlash : true }),  // this automatically check login
    userController.login);


router.get("/logout", userController.logout);


module.exports = router;