const Listing = require("../models/listing.js");
const Review = require("../models/Review.js");


module.exports.createReview = async (req, res) => {
  let id = req.params.id;
  let listing = await Listing.findById(id);

  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;

  listing.review.push(newReview);

  await newReview.save();
  await listing.save();
      req.flash("success", " New Review Created");

  res.redirect(`/listing/${listing._id}`);
};


module.exports.destroyReview = async (req,res)=>{
  let {id,reviewId} = req.params;

await Listing.findByIdAndUpdate(id,{$pull : { review:reviewId } });  //$pull use for match id in listing review and remove
await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");

 res.redirect(`/listing/${id}`);

};