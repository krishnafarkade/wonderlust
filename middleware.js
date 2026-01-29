const Listing = require("./models/listing");
const Review = require("./models/Review.js");

const ExpressError = require ("./utils/ExpressError.js")
const {listingSchema} = require("./Schema.js")
const {reviewSchema} = require("./Schema.js")


module.exports.isLoggIn = (req, res, next) => {
    console.log(req.user);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl =  req.originalUrl;
    req.flash("error", "You must be logged in!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
  if(  req.session.redirectUrl){
    res.locals.redirect =   req.session.redirectUrl;
  }
 next();
}

module.exports.isowner = async(req, res,next )=>{

  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/listing/${id}`);
  }   
  next();
}


module.exports.isreviewAuthor = async(req, res,next )=>{

  const { id , reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/listing/${id}`);
  }   
  next();
}



//for server side - valid listing or review come or not 
// this is relate to Schema.js
module.exports.validatelisting = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    return next(new ExpressError(msg, 400)); 
  }
  next();
};

//for server side - valid listing or review come or not 
// this is relate to Schema.js
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(', ');
    return next(new ExpressError(msg, 400)); 
  } else {
    next();
  }
};