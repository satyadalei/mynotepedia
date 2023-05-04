const mongoose = require("mongoose");
const { Schema } = mongoose;

// this is schema -- it's like blue print
const noteSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  lastModified: { type: Date, default: Date.now },
});

//export a model using that schema
module.exports = mongoose.model("Notes", noteSchema);
