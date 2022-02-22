const app = require("./app");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary");
const connectDatabase = require("./config/database.js");

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shuting down server due to unhandled uncaught exception");
  process.exit(1);
});
// console.log(youtube); // this type of error are uncaught exceptions //
// config
dotenv.config({ path: "server/config/config.env" });

// connecting to database
connectDatabase();
// connecting to cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const server = app.listen(process.env.PORT, () => {
  console.log(`server is working on http://localhost:${process.env.PORT}`);
});

// Handle unhandled promise rejections // this type of error are beacuse of mongodb connection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  console.log("Shuting down server due to unhandled promise rejection");
  // Close server & exit process
  server.close(() => process.exit(1));
});
