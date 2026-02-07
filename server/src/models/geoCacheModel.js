const mongoose = require("mongoose");

const geoCacheSchema = new mongoose.Schema({
  area: { type: String, required: true },
  city: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true }
});

// Ensure combination of city + area is unique
geoCacheSchema.index({ city: 1, area: 1 }, { unique: true });

module.exports = mongoose.model("GeoCache", geoCacheSchema);
