const mongoose = require("mongoose");
const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
    })
    .then((data) => {
      console.log(
        `MongoDB Connected connected with server ${data.connection.host}`
      );
    });

  // it handle by promise rejection in the app.js file
  // .catch((err) => {
  //     console.log(err);
  // });
};

module.exports = connectDatabase;
