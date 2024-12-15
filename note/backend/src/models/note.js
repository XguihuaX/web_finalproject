const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
    },
    context: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

noteSchema.plugin(AutoIncrement, { inc_field: "noteId" });

module.exports = mongoose.model("Note", noteSchema);
