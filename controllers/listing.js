const Listing = require("../models/listing.js");
const axios = require("axios");


module.exports.index = async(req,res)=>{
 let listingAll = await Listing.find();
 res.render("listings/index.ejs",{listingAll});
};

module.exports.renderNewForm = (req,res)=>{
  res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res) => {

  let url = req.file.path;
  let filename = req.file.filename;
   const locationText = req.body.listing.location;

  //  Forward Geocoding (Nominatim)
  const geoResponse = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        q: locationText,
        format: "json",
        limit: 1
      },
      headers: {
        "User-Agent": "Wanderlust-App"
      }
    }
  );

  if (geoResponse.data.length === 0) {
    req.flash("error", "Invalid location");
    return res.redirect("/listing/new");
  }

  const newlisting = new Listing(req.body.listing);

  //  Save Cordinates
  newlisting.coordinates = {
    lat: geoResponse.data[0].lat,
    lng: geoResponse.data[0].lon
  };

  newlisting.owner = req.user._id; // store logged in user's id
  newlisting.image = {filename , url};
  await newlisting.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listing");
};

module.exports.editListing = async(req,res)=>{
  let {id }= req.params;
  let listing = await Listing.findById(id);

  let original_image = listing.image.url;
  let orginalImage = original_image.replace("/upload","/upload/w_250/");
  res.render("listings/edit.ejs",{listing, orginalImage});
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
const listing = await Listing.findById(id);
  if (!listing) {
  req.flash("error", "Listing not found");
  return res.redirect("/listing");
}

  //  If location changed → re-geocode
  if (req.body.listing.location !== listing.location) {
    const geoResponse = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: req.body.listing.location,
          format: "json",
          limit: 1
        },
        headers: {
          "User-Agent": "Wanderlust-App"
        }
      }
    );

    if (geoResponse.data.length === 0) {
      req.flash("error", "Invalid location");
      return res.redirect(`/listing/${id}/edit`);
    }

    listing.coordinates = {
      lat: geoResponse.data[0].lat,
      lng: geoResponse.data[0].lon
    };
  }

  listing.set(req.body.listing);

  const updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing },{ new: true });

  if(req.file){
  let url = req.file.path;
  let filename = req.file.filename;
  updatedListing.image = {filename , url};
  await updatedListing.save();
  console.log(updatedListing);
  }

  req.flash("success", "Listing Edited");
  res.redirect(`/listing/${updatedListing._id}`);
};

module.exports.showListing = async(req,res)=>{
  let {id }= req.params;
  let listing = await Listing.findById(id).populate({path : "review", populate : { path : "author"},}).populate("owner");
  if(!listing){
    req.flash("error","Your requested listing does not exist");
    return res.redirect("/listing");
  }  
  res.render("listings/show.ejs",{listing});
};

module.exports.destroyListing = async(req,res)=>{
  let {id }= req.params;
  let deletelisting=await Listing.findByIdAndDelete(id);
  console.log(deletelisting);
     req.flash("success"," Listing deleted");
  res.redirect("/listing");
};

module.exports.searchlisting =  async (req, res) => {
  try {
    const { q } = req.query;

    const listing = await Listing.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
        { country: { $regex: q, $options: "i" } }
      ]
    });

    return res.render("listings/index", { listingAll: listing });
  } catch (err) {
    console.log(err);
    return res.redirect("/listing");
  }
};
