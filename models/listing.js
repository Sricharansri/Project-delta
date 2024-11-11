const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review=require("./reviews.js");

const listingsc = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: { type: String, default: "listingimage" },
        url: {
            type: String,
            default: "https://www.pexels.com/search/beautiful%20nature/",
            set: (v) => (v === "" || !v ? "https://www.pexels.com/search/beautiful%20nature/" : v),
        }
    
    
    },
    price: {
        type: Number,
        default:0,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review",
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
   
    
});
listingsc.post("findOneAndDelete",async(listing)=>{
    if(listing)
    {
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
   
});

const Listing = mongoose.model("Listing", listingsc);
module.exports = Listing;
