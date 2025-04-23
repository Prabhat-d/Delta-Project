const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const Review = require("./review.js");

let listingSchema = new mongoose.Schema({
    title : {
        type : String,
        require : true
    },
    description : {
        type : String
    },
    image : {
        url : String,
        filename : String, 
    },
    price : {
        type : Number
    },
    location : {
        type : String
    },
    country : {
        type : String
    },
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
    },
    geometry : {
        type : {
            type : String,
            enum : ["Point"],
            required : true, 
        },
        coordinates : {
            type : [Number],//[Longitude, Latitude]
            required : true,
        }
    }
});

listingSchema.post("findOneAndRemove", async (listing) => {
    if(listing) {
        await Review.remove({_id : {$in : listing.reviews}});
    }
});

let Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;


