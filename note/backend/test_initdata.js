const mongoose = require("mongoose");
const process = require("node:process");
const User = require("./src/models/user.js");
const Note = require("./src/models/note.js");
const Image = require("./src/models/image.js");

mongoose
  .connect("mongodb://127.0.0.1:27017/yourDatabaseName")
  .then(() => {
    console.log("MongoDB connected successfully");
    initializeData();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

async function initializeData() {
  try {
    await User.deleteMany({});
    await Note.deleteMany({});
    await Image.deleteMany({});

    const admin = new User({
      username: "admin",
      password: "adminpass",
      status: "admin",
    });
    await admin.save();

    const user = new User({
      username: "user",
      password: "userpass",
      status: "user",
    });
    await user.save();

    console.log("Data initialized successfully");
    process.exit();
  } catch (err) {
    console.error("Error initializing data:", err);
    process.exit(1);
  }
}
