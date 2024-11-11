const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  comment: String,
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  author:{
    type:Schema.Types.ObjectId,
    ref:"User",

  },
});

// Make sure the model name is spelled as 'Review' (not 'Reveiw')
module.exports = mongoose.model("Review", reviewSchema);
