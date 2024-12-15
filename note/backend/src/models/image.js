const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const imageSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

imageSchema.plugin(AutoIncrement, { inc_field: "imageId" });

module.exports = mongoose.model("Image", imageSchema);
