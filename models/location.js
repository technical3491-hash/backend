import mongoose from "mongoose";

const locationSchema = mongoose.Schema({
  city: String,
  country: String,
  weatherData: Object,
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

const LocationModel = mongoose.model("Location", locationSchema);

export default LocationModel;