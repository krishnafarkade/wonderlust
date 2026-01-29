const express = require("express");
const router = express.Router({mergeParams : true});

const Review = require("../models/Review.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require ("../utils/ExpressError.js")

const{ validateReview, isLoggIn , isreviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/review.js");

//Review post req
router.post("/",validateReview,isLoggIn, wrapAsync(reviewController.createReview));

//review delete route
router.delete("/:reviewId" ,isLoggIn,isreviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;