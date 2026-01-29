const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const Review = require("./Review");



const ListingSchema = new Schema({
    title : {
        type: String,
        // required : true
    },
    description :{
        type :String,
                // required : true

    } ,
    
    image:{
        filename : String,
        url:String
      },
      
  price: {
  type: Number,
  default: 0
},
    location : String,
    country : String,

    coordinates: {
    lat: Number,
    lng: Number
  },
  
    review : [
        {
        type : Schema.Types.ObjectId,
        ref : "Review",
        }
    ],
    owner : {
      type: Schema.Types.ObjectId,
      ref : "User"
    }  
});

ListingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({
      _id: { $in: listing.review }
    });
    console.log("Related reviews deleted");
  }
});


const Listing = mongoose.model("Listing",ListingSchema )
module.exports = Listing;