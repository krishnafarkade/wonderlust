const express = require("express");
const router = express.Router();

const multer  = require('multer');
const {storage} = require("../cloudConfig.js")

const upload = multer({ storage});

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require ("../utils/ExpressError.js")
const {listingSchema} = require("../Schema.js")
const{ isLoggIn , isowner , validatelisting } = require("../middleware.js");

const listingController = require("../controllers/listing.js");

router.route("/search")
.get(listingController.searchlisting);


// index route create route
router.route("/")
.get(wrapAsync(listingController.index))
.post( isLoggIn,upload.single('listing[image][url]'), wrapAsync(listingController.createListing));


//new route
router.get("/new",isLoggIn,listingController.renderNewForm);

//update route //show rout read //delete route
router.route("/:id")
.put(isLoggIn,isowner,upload.single('listing[image][url]'), validatelisting, wrapAsync(listingController.updateListing))
.get(wrapAsync(listingController.showListing))
.delete(isLoggIn,isowner,listingController.destroyListing);

//edit route
router.get("/:id/edit",isLoggIn,isowner,wrapAsync(listingController.editListing));


module.exports = router