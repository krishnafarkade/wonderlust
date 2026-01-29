const User = require("../models/user.js");


module.exports.renderSighupForm = (req,res)=>{
    res.render("users/sighup.ejs");
};

module.exports.sighup = async(req,res)=>{
    try{   let { username , email , password} = req.body;
    const newuser = new User({username , email});
    const registerUser = await User.register(newuser , password);
    console.log(registerUser);
    req.login(registerUser,(err)=>{
        if(err){
            return next(err);
        }   
        req.flash("success", "Welcome to the Wonderlus!");
    return res.redirect("/listing");
    })
    }catch(e){
    req.flash("error",e.message);
    return res.redirect("/sighup");
}};


module.exports.renderloginForm = (req,res)=>{
      res.render("users/login.ejs");
};


module.exports.login = async(req,res)=>{           // this is for after login go on that page 
const redirectUrl = res.locals.redirect || "/listing";
delete req.session.redirectUrl;
return res.redirect(redirectUrl);
};


module.exports.logout = (req, res, next) => {
  req.logout(function(err) {                //in built function in passport -   req.logout
    if (err) { return next(err); }
    req.flash("success", "You have been logged out.");
    return res.redirect("/listing");
  });
};